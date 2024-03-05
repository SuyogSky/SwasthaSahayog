from django.shortcuts import render
from django.db.models import Subquery, OuterRef, Q
from rest_framework import generics, status
from chat.models import ChatMessage
from chat.serializer import MessageSerializer, SendMessageSerializer
from accounts.models import BaseUser
from accounts.serializer import BaseUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Create your views here.
class MyInbox(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        messages = ChatMessage.objects.filter(
            id__in =  Subquery(
                BaseUser.objects.filter(
                    Q(sender__receiver=user_id) |
                    Q(receiver__sender=user_id)
                ).distinct().annotate(
                    last_msg=Subquery(
                        ChatMessage.objects.filter(
                            Q(sender=OuterRef('id'),receiver=user_id) |
                            Q(receiver=OuterRef('id'),sender=user_id)
                        ).order_by('-id')[:1].values_list('id',flat=True) 
                    )
                ).values_list('last_msg', flat=True).order_by("-id")
            )
        ).order_by("-id")
            
        return messages
    
class GetMessages(generics.ListAPIView):
    serializer_class = MessageSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        receiver_id = self.kwargs['receiver_id']

        messages = ChatMessage.objects.filter(
            sender__in=[sender_id, receiver_id],
            receiver__in=[sender_id, receiver_id]
        )

        return messages
    
# class SendMessage(generics.CreateAPIView):
#     serializer_class = MessageSerializer
#     # permission_classes = [IsAuthenticated]
    
class SendMessage(generics.CreateAPIView):
    serializer_class = SendMessageSerializer
    def perform_create(self, serializer):
        user = self.request.data.get('user') 
        sender = self.request.data.get('sender') 
        receiver = self.request.data.get('receiver') 

        user_instance = BaseUser.objects.get(id=user) 
        sender_instance = BaseUser.objects.get(id=sender) 
        receiver_instance = BaseUser.objects.get(id=receiver) 

        # Associate the message with the user instance
        serializer.save(user=user_instance, sender=sender_instance, receiver=receiver_instance)

class ProfileDetail(generics.RetrieveAPIView):
    serializer_class = BaseUserSerializer
    queryset = BaseUser.objects.all()
    permission_classes = [IsAuthenticated]

class SearchUser(generics.ListAPIView):
    serializer_class = BaseUserSerializer
    queryset = BaseUser.objects.all()
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        username = self.kwargs['username']
        logged_in_user = self.request.user
        users = BaseUser.objects.filter(
            Q(username__icontains=username) |
            Q(email__icontains=username) &
            ~Q(id=logged_in_user.id)  # Assuming logged_in_user is a BaseUser instance
        )


        if not users.exists():
            return Response(
                {"detail":"No users found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
