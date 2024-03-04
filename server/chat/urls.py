from django.urls import path
from .views import MyInbox, GetMessages, SendMessage, ProfileDetail , SearchUser


urlpatterns = [
    path('my-messages/<user_id>/', MyInbox.as_view()),
    path('get-messages/<sender_id>/<reciever_id>/', GetMessages.as_view()),
    path('send-messages/', SendMessage.as_view()),


    path('profile/<int:pk>/', ProfileDetail.as_view()),
    path('search/<username>/', SearchUser.as_view()),
]
