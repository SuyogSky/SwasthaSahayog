from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from reviews.serializer import ReviewSerializer
from accounts.serializer import DoctorSerializer
from accounts.models import BaseUser, Doctor
from rest_framework.response import Response
from rest_framework import generics, status
from reviews.models import *
from django.http import JsonResponse
from django.db.models import Avg


# Create your views here.
class AddReview(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    def post(self, request, doctor):
        # Retrieve the post object
        try:
            doctor = Doctor.objects.get(pk=doctor)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        # Create a comment
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=doctor, reviewer=request.user)  # Assuming you're using authentication
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DoctorReviewsListView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']  # Getting doctor_id from URL kwargs
        return Reviews.objects.filter(doctor_id=doctor_id)


class DoctorWithAverageRatingView(APIView):
    def get(self, request):
        # Get verified doctors
        doctors = Doctor.objects.filter(is_verified=True)
        
        # List to store the average rating for each doctor
        doctor_ratings = []
        
        for doctor in doctors:
            # Calculate average rating for the current doctor
            average_rating = Reviews.objects.filter(doctor=doctor).aggregate(avg_rating=Avg('ratings'))['avg_rating']
            
            # If there are no reviews for the doctor, set average_rating to 0
            if average_rating is None:
                average_rating = 0
            else:
                # Round the average rating to the nearest integer
                average_rating = round(average_rating)
            
            # Serialize the doctor model
            doctor_serializer = DoctorSerializer(doctor)
            
            # Create a dictionary containing the average rating and the serialized doctor model
            doctor_data = {
                'doctor': doctor_serializer.data,
                'average_rating': average_rating,
            }
            
            # Add the dictionary to the list
            doctor_ratings.append(doctor_data)
        
        # Return list of dictionaries in JSON response
        return JsonResponse(doctor_ratings, safe=False)