# myproject/routing.py
from django.urls import path
from chat.consumers import *

websocket_urlpatterns = [
    path('ws/chat/<sender_id>/<receiver_id>/', Chating.as_asgi()),
]