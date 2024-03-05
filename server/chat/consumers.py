import json
import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer

from channels.db import database_sync_to_async
from chat.models import ChatMessage
from django.core.serializers.json import DjangoJSONEncoder
from accounts.models import BaseUser
from accounts.serializer import BaseUserSerializer

class Chating(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.sender_id = int(self.scope['url_route']['kwargs']['sender_id'])
        self.receiver_id = int(self.scope['url_route']['kwargs']['receiver_id'])
        self.room_channel_name = f"chat_{min(self.sender_id, self.receiver_id)}_{max(self.sender_id, self.receiver_id)}"
        await self.channel_layer.group_add(
            self.room_channel_name,
            self.channel_name
        )
        
    async def disconnect(self , close_code):
        await self.channel_layer.group_discard(
            self.room_channel_name,
            self.channel_name
        )


    @database_sync_to_async
    def save_message_to_database(self, sender, receiver, text):
        # Save the message to the database
        print("Message Saved To database.")
        message = ChatMessage.objects.create(
            # chat_groupName=str(self.room_channel_name),
            user=sender,
            sender=sender,
            receiver=receiver,
            message=text,
        )
        return message
    
    @database_sync_to_async
    def get_user_instance(self, user_id):
        return BaseUser.objects.get(id=user_id)
    
    async def receive(self, text_data):
        print("Received Data: ", text_data)
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        sender_id = text_data_json["sender"]
        receiver_id = text_data_json["receiver"]

        sender = await self.get_user_instance(sender_id)
        receiver = await self.get_user_instance(receiver_id)

        self.message_=message
        self.sender=sender
        self.received_ = receiver

        await self.save_message_to_database(sender, receiver, message)
        await self.channel_layer.group_send(
            self.room_channel_name,{
                "type" : 'message' ,
                "message" : message , 
                "sender" : BaseUserSerializer(sender).data,
                "receiver" : BaseUserSerializer(receiver).data,
            })
        
    # @channel_layer.message
    async def message(self, event):
        print("Sending Message....")
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'receiver': event['receiver'],
            'timestamp': 'event',
        }))