from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import BaseUser

from post.models import Post
from post.serializer import PostSerializer
from django.shortcuts import get_object_or_404
from django.views.generic import ListView
from rest_framework.views import APIView

  
class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Associate the currently logged-in user with the post
        user = self.request.user
        content = self.request.data.get('content', '')
        image = self.request.data.get('image', None)
        print(content, image)
        # Create the post with or without an image
        if image:
            serializer.save(user=user, content=content, image=image)
        else:
            serializer.save(user=user, content=content)


class PostRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

class UserPostsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        user_posts = Post.objects.filter(user__id=user_id).order_by('-date')
        serializer = PostSerializer(user_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)