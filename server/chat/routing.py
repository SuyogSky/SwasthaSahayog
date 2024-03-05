from django.urls import re_path

from .consumer import Chating

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<sender_id>\d+)/(?P<receiver_id>\d+)/$', Chating.as_asgi()),
]