from rest_framework import serializers
from post.models import Post, Comment
from accounts.serializer import BaseUserSerializer

class PostSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    user = BaseUserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'date', 'content', 'image', 'user')

    def create(self, validated_data):
        # Add the currently logged-in user to the validated data
        validated_data['user'] = self.context['request'].user

        # Create and return the new Post instance
        return super().create(validated_data)
    

class CommentSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    user = BaseUserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'text', 'user', 'date']


class PostWithCommentsSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    user = BaseUserSerializer(read_only = True)
    class Meta:
        model = Post
        fields = ['id', 'date', 'content', 'image', 'user', 'comments']
