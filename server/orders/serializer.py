from rest_framework import serializers
from orders.models import *
from accounts.serializer import ClientSerializer, PharmacistSerializer

class MedicineOrderSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    pharmacy = PharmacistSerializer(read_only = True)

    class Meta:
        model = MedicineOrders
        fields = ['id', 'client', 'pharmacy', 'medicine_description', 'medicine_description_image', 'order_description', 'order_location']

        def create(self, validated_data):
            validated_data['client'] = self.context['request'].user.client

            return super().create(validated_data)