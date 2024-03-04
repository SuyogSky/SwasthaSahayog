from rest_framework import serializers
from post.models import Post
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
