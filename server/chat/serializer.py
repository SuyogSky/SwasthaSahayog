from rest_framework import serializers
from chat.models import ChatMessage
from accounts.serializer import BaseUserSerializer

class MessageSerializer(serializers.ModelSerializer):
    user = BaseUserSerializer()
    sender = BaseUserSerializer()
    receiver = BaseUserSerializer()
    class Meta:
        model = ChatMessage
        fields = ('id', 'user', 'sender', 'receiver', 'image', 'message', 'is_read', 'date')

class SendMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ('id', 'user', 'sender', 'receiver', 'image', 'message', 'is_read', 'date')


