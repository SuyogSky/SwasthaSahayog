from django.urls import path
from .views import *

urlpatterns = [
    path('posts/', PostListCreateAPIView.as_view(), name='post-list-create'),
    path('user-posts/<int:user_id>', UserPostsAPIView.as_view(), name='post-retrieve-update-destroy'),
    path('post/<pk>', PostRetrieveUpdateDestroyAPIView.as_view(), name='post-list-create'),
    path('post/<int:post_id>/comment/', AddCommentView.as_view(), name='add_comment'),
    path('post-detail/<int:post_id>/', PostWithCommentsDetailView.as_view(), name='post-with-comments-detail'),
]
