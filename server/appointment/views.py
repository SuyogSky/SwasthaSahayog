from django.shortcuts import render
from rest_framework import generics, status
from appointment.models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from appointment.serializer import *

class AppointmentListCreateView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Associate the currently logged-in user with the appointment
        user = self.request.user
        date = self.request.data.get('date', None)
        time = self.request.data.get('time', None)
        comments = self.request.data.get('comments', None)
        doctor = Doctor.objects.get(id=self.request.data.get('doctor'))

        # Uncomment the next line to save the appointment with the associated doctor
        serializer.save(client=user, doctor=doctor, date=date, time=time, comments=comments)


class DoctorAppointmentsListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the logged-in doctor
        doctor = self.request.user.doctor

        # Filter appointments for the logged-in doctor
        queryset = Appointment.objects.filter(doctor=doctor).order_by('-date', '-time')
        return queryset


class ClientAppointmentsListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the currently logged-in client
        client = self.request.user

        # Filter appointments for the logged-in client
        queryset = Appointment.objects.filter(client=client).order_by('-date', '-time')
        return queryset


class AppointmentApprovalView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()

        # Check if the logged-in user is the associated doctor for the appointment
        logged_in_doctor = self.request.user.doctor
        if logged_in_doctor != appointment.doctor:
            return Response({'detail': 'You do not have permission to approve this appointment.'}, status=403)

        # Update the appointment status to 'approved'
        appointment.status = 'approved'
        appointment.save()

        serializer = self.get_serializer(appointment)
        return Response(serializer.data)