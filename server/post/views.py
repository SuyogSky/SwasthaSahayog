from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import BaseUser

from post.models import Post
from post.serializer import *
from django.shortcuts import get_object_or_404
from django.views.generic import ListView
from rest_framework.views import APIView

  
class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Associate the currently logged-in user with the post
        user = self.request.user
        content = self.request.data.get('content', '')
        image = self.request.data.get('image', None)
        print(content, image)
        # Create the post with or without an image
        if image:
            serializer.save(user=user, content=content, image=image)
        else:
            serializer.save(user=user, content=content)


class PostRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

class UserPostsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        user_posts = Post.objects.filter(user__id=user_id).order_by('-date')
        serializer = PostSerializer(user_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AddCommentView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    def post(self, request, post_id):
        # Retrieve the post object
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        # Create a comment
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, user=request.user)  # Assuming you're using authentication
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PostWithCommentsDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostWithCommentsSerializer
    lookup_url_kwarg = 'post_id'  # Assuming you are passing post_id in the URL