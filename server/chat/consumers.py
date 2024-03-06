import json
import django
import os
import base64
from django.core.files.base import ContentFile

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer

from channels.db import database_sync_to_async
from chat.models import ChatMessage
from django.core.serializers.json import DjangoJSONEncoder
from accounts.models import BaseUser
from accounts.serializer import BaseUserSerializer
import asyncio


class Chating(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = int(self.scope['url_route']['kwargs']['sender_id'])
        self.receiver_id = int(self.scope['url_route']['kwargs']['receiver_id'])
        self.room_channel_name = f"chat_{min(self.sender_id, self.receiver_id)}_{max(self.sender_id, self.receiver_id)}"
        # Join channel
        await self.channel_layer.group_add(
            self.room_channel_name,
            self.channel_name
        )
        await self.accept()
        
    async def disconnect(self , close_code):
        # leave channel
        await self.channel_layer.group_discard(
            self.room_channel_name,
            self.channel_name
        )


    @database_sync_to_async
    def save_message_to_database(self, sender, receiver, text=None, image=None):
        # Save the message to the database
        print("Message Saved To database.")
        message = ChatMessage.objects.create(
            user=sender,
            sender=sender,
            receiver=receiver,
            message=text,
        )
        
        # If image is provided, associate it with the message
        if image:
            message.image = image
            message.save()

        return message

    
    @database_sync_to_async
    def get_user_instance(self, user_id):
        return BaseUser.objects.get(id=user_id)
    
    # async def receive(self, text_data):
    #     print("Received Data: ", text_data)
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json["message"]
    #     image = ContentFile(base64.b64decode(text_data_json["image"]), name='image.jpg')
    #     sender_id = text_data_json["sender"]
    #     receiver_id = text_data_json["receiver"]

    #     sender = await self.get_user_instance(sender_id)
    #     receiver = await self.get_user_instance(receiver_id)

    #     self.message_=message
    #     self.sender=sender
    #     self.received_ = receiver

    #     await self.save_message_to_database(sender, receiver, message, image)
    #     await self.channel_layer.group_send(
    #         self.room_channel_name,{
    #             "type" : 'message' ,
    #             "message" : message , 
    #             "image" : image , 
    #             "sender" : BaseUserSerializer(sender).data,
    #             "receiver" : BaseUserSerializer(receiver).data,
    #         })

    async def receive(self, text_data):
        print("Received Data: ", text_data)
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message", "")
        image_data = text_data_json.get("image")

        sender_id = text_data_json["sender"]
        receiver_id = text_data_json["receiver"]

        sender = await self.get_user_instance(sender_id)
        receiver = await self.get_user_instance(receiver_id)

        if message and image_data:
            # Both message and image are present
            image = ContentFile(base64.b64decode(image_data), name='image.jpg')
            await self.save_message_to_database(sender, receiver, message, image)
        elif message:
            # Only message is present
            await self.save_message_to_database(sender, receiver, message)
        elif image_data:
            # Only image is present
            image = ContentFile(base64.b64decode(image_data), name='image.jpg')
            await self.save_message_to_database(sender, receiver, image=image)

        await self.channel_layer.group_send(
            self.room_channel_name, {
                "type": 'message',
                "message": message,
                "image": image_data,  # Send the raw image data if it exists
                "sender": BaseUserSerializer(sender).data,
                "receiver": BaseUserSerializer(receiver).data,
            }
        )

        
    # @channel_layer.message
    async def message(self, event):
        print("Sending Message....")
        image_data = ''

        if event['image']:
            if isinstance(event['image'], str):
                # If 'image' is a string (file name), use it directly
                image_data = event['image']
            else:
                # If 'image' is a file-like object, read and encode it
                with event['image'].open() as f:
                    image_data = base64.b64encode(f.read()).decode('utf-8')

        await self.send(text_data=json.dumps({
            'message': event['message'],
            'image': image_data,
            'sender': event['sender'],
            'receiver': event['receiver'],
            'timestamp': 'event',
        }))




class BinaryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, bytes_data):
        # Assume bytes_data is base64-encoded binary image data

        binary_image_data = base64.b64decode(bytes_data)

        # Create a ContentFile from the binary data
        content_file = ContentFile(binary_image_data, name='image.jpg')

        # Save binary data to your model
        sender_id = self.scope['url_route']['kwargs']['sender_id']
        receiver_id = self.scope['url_route']['kwargs']['receiver_id']

        sender = await self.get_user_instance(sender_id)
        receiver = await self.get_user_instance(receiver_id)

        # Save the binary image data to the database
        await self.save_binary_data_to_database(sender, receiver, content_file)

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def get_user_instance(self, user_id):
        return BaseUser.objects.get(id=user_id)

    @database_sync_to_async
    def save_binary_data_to_database(self, sender, receiver, binary_data):
        # Save binary data to your model
        message = ChatMessage.objects.create(
            user=sender,
            sender=sender,
            receiver=receiver,
            image=binary_data,  # Assuming 'image' is a BinaryField in your model
        )
        print("Binary Data Saved To Database.")
        return message