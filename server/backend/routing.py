# myproject/routing.py
from django.urls import path
from chat.consumers import *

websocket_urlpatterns = [
    path('ws/binary-channel/<sender_id>/<receiver_id>/', BinaryConsumer.as_asgi()),
    path('ws/chat/<sender_id>/<receiver_id>/', Chating.as_asgi()),
]