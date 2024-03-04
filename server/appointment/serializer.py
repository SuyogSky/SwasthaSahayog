from rest_framework import serializers
from accounts.serializer import BaseUserSerializer, DoctorSerializer
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    client = BaseUserSerializer(read_only=True)  # Assuming you have a serializer for the Client model
    date = serializers.DateField()
    doctor = DoctorSerializer(read_only=True)  # Assuming you have a serializer for the Doctor model
    time = serializers.TimeField()

    class Meta:
        model = Appointment
        fields = ['id', 'client', 'doctor', 'date', 'time', 'comments', 'status']

    def create(self, validated_data):
        # Add the currently logged-in user to the validated data
        validated_data['client'] = self.context['request'].user

        # Create and return the new Post instance
        return super().create(validated_data)