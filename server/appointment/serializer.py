from rest_framework import serializers
from accounts.serializer import BaseUserSerializer, DoctorSerializer, ClientSerializer
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    date = serializers.DateField()
    doctor = DoctorSerializer(read_only=True)
    time = serializers.TimeField()

    class Meta:
        model = Appointment
        fields = ['id', 'client', 'doctor', 'date', 'time', 'comments', 'status']

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user.client
        return super().create(validated_data)