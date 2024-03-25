from django.shortcuts import render
from rest_framework import generics, status
from appointment.models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from appointment.serializer import *
from rest_framework.generics import CreateAPIView
from django.core.mail import send_mail
from django.conf import settings
# class AppointmentListCreateView(generics.ListCreateAPIView):
#     queryset = Appointment.objects.all()
#     serializer_class = AppointmentSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         # Associate the currently logged-in user with the appointment
#         user = self.request.user
#         date = self.request.data.get('date', None)
#         time = self.request.data.get('time', None)
#         comments = self.request.data.get('comments', None)
#         doctor = Doctor.objects.get(id=self.request.data.get('doctor'))

#         # Uncomment the next line to save the appointment with the associated doctor
#         serializer.save(client=user, doctor=doctor, date=date, time=time, comments=comments)


class IsClient(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'client'
    
class IsDoctor(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'doctor'
    

class AppointmentListCreateView(CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def post(self, request, *args, **kwargs):
        # Associate the currently logged-in user with the appointment
        user = request.user.client
        date = request.data.get('date', None)
        time = request.data.get('time', None)
        comments = request.data.get('comments', None)
        doctor = Doctor.objects.get(id=request.data.get('doctor'))

        # Check if there is any approved appointment with the same date and time
        existing_appointment = Appointment.objects.filter(
            date=date,
            time=time,
            status='approved'
        ).exists()

        if not existing_appointment:
            # No approved appointment with the same date and time
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(client=user, doctor=doctor, date=date, time=time, comments=comments)
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    'success': 1,
                    'message': 'Appointment Scheduled.'
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        else:
            # An approved appointment already exists at the specified date and time
            return Response(
                {
                    'success': 0,
                    'message': 'This time is already booked.'
                },
                # status=status.HTTP_400_BAD_REQUEST
            )

class ApprovedAppointmentTimeListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the appointment date from the query parameters
        appointment_date = self.request.query_params.get('appointment_date')

        if not appointment_date:
            return Response(
                {'error': 'Appointment date is required in the query parameters.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Filter appointments based on date and status
        queryset = Appointment.objects.filter(
            date=appointment_date,
            status='approved'
        )

        # Extract only the time from the appointments
        appointment_times = [appointment.time for appointment in queryset]

        return appointment_times

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(queryset, status=status.HTTP_200_OK)
    
class DoctorAppointmentsListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the logged-in doctor
        doctor = self.request.user.doctor

        # Filter appointments for the logged-in doctor
        queryset = Appointment.objects.filter(doctor=doctor).order_by('date', 'time')
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

        client_email = appointment.client.email
        subject = 'Appointment Approved'
        message = 'Your appointment has been approved.'
        send_mail('Appointment Approved', 'Your appointmetn has been approved.', 'settings.EMAIL_HOST_USER', [client_email])

        serializer = self.get_serializer(appointment)
        return Response(serializer.data)