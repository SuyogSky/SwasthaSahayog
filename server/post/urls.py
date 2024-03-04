from django.urls import path
from .views import PostListCreateAPIView, PostRetrieveUpdateDestroyAPIView, UserPostsAPIView

urlpatterns = [
    path('posts/', PostListCreateAPIView.as_view(), name='post-list-create'),
    path('user-posts/<int:user_id>', UserPostsAPIView.as_view(), name='post-retrieve-update-destroy'),
    path('post/<pk>', PostRetrieveUpdateDestroyAPIView.as_view(), name='post-list-create'),
]
