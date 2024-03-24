from rest_framework import serializers
from reviews.models import Reviews
from accounts.serializer import BaseUserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    doctor = BaseUserSerializer(read_only=True)
    reviewer = BaseUserSerializer(read_only=True)
    class Meta:
        model = Reviews
        fields = ('id', 'doctor', 'reviewer', 'ratings', 'review', 'date')