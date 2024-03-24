from django.urls import path
from .views import MyInbox, GetMessages, SendMessage, ProfileDetail , SearchUser, MarkMessagesAsReadView


urlpatterns = [
    path('my-messages/<user_id>/', MyInbox.as_view()),
    path('mark_messages_as_read/<int:sender_id>/<int:receiver_id>/', MarkMessagesAsReadView.as_view(), name='mark_messages_as_read'),
    path('get-messages/<sender_id>/<receiver_id>/', GetMessages.as_view()),
    path('send-messages/', SendMessage.as_view()),


    path('profile/<int:pk>/', ProfileDetail.as_view()),
    path('search/<username>/', SearchUser.as_view()),
]
