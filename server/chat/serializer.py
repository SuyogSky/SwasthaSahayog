from rest_framework import serializers
from chat.models import ChatMessage
from accounts.serializer import BaseUserSerializer

class MessageSerializer(serializers.ModelSerializer):
    user = BaseUserSerializer()
    sender = BaseUserSerializer()
    reciever = BaseUserSerializer()
    class Meta:
        model = ChatMessage
        fields = ('id', 'user', 'sender', 'reciever', 'message', 'is_read', 'date')