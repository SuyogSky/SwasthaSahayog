from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from orders.models import *
from orders.serializer import *
from rest_framework.permissions import IsAuthenticated
from accounts.models import Pharmacist
from rest_framework.response import Response
from rest_framework import generics, status

# Create your views here.
class OrderListCreateView(CreateAPIView):
    queryset = MedicineOrders.objects.all()
    serializer_class = MedicineOrderSerializer
    permission_class = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            client = request.user.client
        except Exception as e:
            print('User not found')
            return Response(
                {
                    'success': 0,
                    'error': 'Permission Not Allowed.'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            pharmacy = Pharmacist.objects.get(id=request.data.get('pharmacy'))
        except Exception as e:
            print('Pharmacy Not Found.')
            return Response(
                {
                    'success': 0,
                    'error': 'Pharmacy not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        date = request.data.get('date', None)
        medicine_description = request.data.get('medicine_description')
        medicine_description_image = request.data.get('medicine_description_image')
        print(medicine_description_image)
        order_description = request.data.get('order_description')
        order_location = request.data.get('order_location')

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(client=client, pharmacy=pharmacy, date=date, medicine_description=medicine_description, medicine_description_image=medicine_description_image, order_description=order_description, order_location=order_location)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'success': 1,
                'message': 'Medicine ordered successfully.'
            },
            status=status.HTTP_201_CREATED
        )



class PharmacistOrderListView(generics.ListAPIView):
    serializer_class = MedicineOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the logged-in pharmacist
        pharmacist = self.request.user.pharmacist

        # Filter appointments for the logged-in pharmacist
        queryset = MedicineOrders.objects.filter(pharmacy=pharmacist).order_by('date')
        return queryset