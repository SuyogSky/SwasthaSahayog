from django.shortcuts import render

from accounts.models import BaseUser, Client, Pharmacist, Doctor
from accounts.serializer import *


from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from django.http import JsonResponse
from django.contrib.auth.hashers import check_password

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = BaseUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# Get All Routes

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "TEXT"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)


class ClientRegisterView(generics.CreateAPIView):
    queryset = Client.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = ClientRegisterSerializer

class DoctorRegisterView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = DoctorRegisterSerializer

class PharmacistRegisterView(generics.CreateAPIView):
    queryset = Pharmacist.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = PharmacistRegisterSerializer

class DoctorListView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]


class UserDetails(generics.RetrieveAPIView):
    queryset = BaseUser.objects.all()
    serializer_class = BaseUserSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]

class ClientDetailView(generics.RetrieveAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]

class DoctorDetailView(generics.RetrieveAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]

class UpdateBioView(APIView):
    def patch(self, request, user_id, *args, **kwargs):
        user = get_object_or_404(BaseUser, id=user_id)
        try:
            new_bio = request.data.get('bio')
            user.bio = new_bio
            print(new_bio)
            user.save()
            return Response({'message': 'Bio updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UpdateProfilePictureView(APIView):
    def patch(self, request, user_id, *args, **kwargs):
        user = get_object_or_404(BaseUser, id=user_id)
        try:
            # Use a serializer to handle file uploads
            serializer = BaseUserSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ClientProfileEditView(generics.RetrieveUpdateDestroyAPIView):
    def patch(self, request, user_id, *args, **kwargs):
        user = get_object_or_404(Client, id=user_id)
        try:
            user.username = request.data.get('username')
            user.email = request.data.get('email')
            user.phone = request.data.get('phone')
            user.address = request.data.get('address')
            user.gender = request.data.get('gender')
            user.date_of_birth = request.data.get('date_of_birth')
            user.blood_group = request.data.get('blood_group')
            user.bio = request.data.get('bio')

            user.save()
            return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# class DoctorProfileEditView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Doctor.objects.all()
#     serializer_class = DoctorSerializer
#     permission_classes = [IsAuthenticated]

#     def get_object(self):
#         return self.request.user

#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', False)
#         instance = self.get_object()
#         serializer = DoctorProfileUpdateSerializer(instance, data=request.data, partial=partial)
#         print(request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
#         return Response(serializer.data)


class DoctorProfileEditView(generics.RetrieveUpdateDestroyAPIView):
    def patch(self, request, user_id, *args, **kwargs):
        user = get_object_or_404(Doctor, id=user_id)
        try:
            user.username = request.data.get('username')
            user.email = request.data.get('email')
            user.phone = request.data.get('phone')
            user.address = request.data.get('address')
            user.bio = request.data.get('bio')
            user.opening_time = request.data.get('opening_time')
            user.closing_time = request.data.get('closing_time')
            user.appointment_duration = request.data.get('appointment_duration')
            user.service_charge = request.data.get('service_charge')
            user.speciality = request.data.get('speciality')

            user.save()
            return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# class MedicalBackgroundEditView(generics.RetrieveUpdateDestroyAPIView):
#     def patch(self, request, user_id, *args, **kwargs):
#         user = get_object_or_404(Doctor, id=user_id)
#         try:
#             user.home_checkup_service = request.data.get('home_checkup_service')
#             # if(request.data.get('medical_license')):
#             user.medical_license = request.data.get('medical_license')
#             user.medical_background = request.data.get('medical_background')
#             user.save()
#             return Response({'message': 'Medical Background updated successfully'}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            


class MedicalBackgroundEditView(generics.RetrieveUpdateDestroyAPIView):
    def patch(self, request, user_id, *args, **kwargs):
        user = get_object_or_404(Doctor, id=user_id)
        serializer = DoctorSerializer(user, data=request.data, partial=True)  # Initialize serializer with instance and data
        if serializer.is_valid():
            serializer.save()  # Save serializer if valid
            return Response({'message': 'Medical Background updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


    


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user

        old_password = serializer.validated_data.get('old_password')
        new_password = serializer.validated_data.get('new_password')

        if check_password(old_password, user.password):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'old_password': ['Incorrect password.']}, status=status.HTTP_400_BAD_REQUEST)