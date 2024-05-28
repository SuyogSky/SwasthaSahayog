from django.shortcuts import render
from rest_framework import generics, status
from appointment.models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from appointment.serializer import *
from rest_framework.generics import CreateAPIView
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

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


# class AppointmentApprovalView(generics.UpdateAPIView):
#     queryset = Appointment.objects.all()
#     serializer_class = AppointmentSerializer
#     permission_classes = [IsAuthenticated]

#     def update(self, request, *args, **kwargs):
#         appointment = self.get_object()

#         # Check if the logged-in user is the associated doctor for the appointment
#         logged_in_doctor = self.request.user.doctor
#         if logged_in_doctor != appointment.doctor:
#             return Response({'detail': 'You do not have permission to approve this appointment.'}, status=403)

#         # Update the appointment status to 'approved'
#         appointment.status = 'approved'
#         appointment.save()

#         client_email = appointment.client.email
#         subject = 'Appointment Approved'
#         message = 'Your appointment has been approved.'
#         send_mail('Appointment Approved', 'Your appointmetn has been approved.', 'settings.EMAIL_HOST_USER', [client_email])

#         serializer = self.get_serializer(appointment)
#         return Response(serializer.data)
    


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

        subject = 'Appointment Approved'
        html_content="""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Email</title>
            </head>
            <body style="font-family: Arial, sans-serif;line-height: 1.6;color: black;">
                <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 6px; text-align: center;">
                    <div class="header" style="background-color: #88CB44; border-radius: 6px 6px 0 0; text-align: center; padding: 1px; color: white;">
                        <h2 style="color: white;">Appointment Approval</h2>
                    </div>
                    <div class="content" style="padding: 20px 0; color: black;">
                        <p style="font-size: 22px; font-weight: 500; color: black;">Hello, {user}</p>
                        <p style="font-size: 22px; font-weight: 500; color: black;">Your appointment with {doctor} on {date} at {time} has been approved.</p>
                        <p class="otp" style="padding: 3px 20px; color: #6aa231; font-size: 24px; font-weight: 500; border: 2px solid #6aa231; background-color: #effce8; width: max-content; margin: 0 auto; border-radius: 6px; cursor: pointer; transition: all 0.3s ease-in-out;">Approved</p>
                    </div>
                    <br>
                    <div style="background-color: #f4f4f4; padding: 10px; border-radius: 0 0 5px 5px;">
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        """.format(user=appointment.client.username, doctor=appointment.doctor.username, date=appointment.date, time=appointment.time)
        message = EmailMultiAlternatives(subject, '', settings.EMAIL_HOST_USER, [appointment.client.email])
        message.attach_alternative(html_content, "text/html")
        message.send()
        
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

class AppointmentRejectView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()

        # Check if the logged-in user is the associated doctor for the appointment
        logged_in_doctor = self.request.user.doctor
        if logged_in_doctor != appointment.doctor:
            return Response({'detail': 'You do not have permission to reject this appointment.'}, status=403)

        # Update the appointment status to 'approved'
        appointment.status = 'rejected'
        appointment.save()

        subject = 'Appointment Rejected'
        html_content="""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Email</title>
            </head>
            <body style="font-family: Arial, sans-serif;line-height: 1.6;color: black;">
                <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 6px; text-align: center;">
                    <div class="header" style="background-color: #88CB44; border-radius: 6px 6px 0 0; text-align: center; padding: 1px; color: white;">
                        <h2 style="color: white;">Appointment Status</h2>
                    </div>
                    <div class="content" style="padding: 20px 0; color: black;">
                        <p style="font-size: 22px; font-weight: 500; color: black;">Hello, {user}</p>
                        <p style="font-size: 22px; font-weight: 500; color: black;">Your appointment with {doctor} on {date} at {time} has been rejected due to certain reasons.</p>
                        <p class="otp" style="padding: 3px 20px; color: rgb(218, 139, 139); font-size: 24px; font-weight: 500; border: 2px solid rgb(246, 176, 176); background-color: rgba(246, 185, 185, 0.603); width: max-content; margin: 0 auto; border-radius: 6px; cursor: pointer; transition: all 0.3s ease-in-out;">Rejected</p>
                    </div>
                    <br>
                    <div style="background-color: #f4f4f4; padding: 10px; border-radius: 0 0 5px 5px;">
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        """.format(user=appointment.client.username, doctor=appointment.doctor.username, date=appointment.date, time=appointment.time)
        message = EmailMultiAlternatives(subject, '', settings.EMAIL_HOST_USER, [appointment.client.email])
        message.attach_alternative(html_content, "text/html")
        message.send()
        
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)


class AppointmentCancelView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()

        # Check if the logged-in user is the associated doctor for the appointment
        logged_in_doctor = self.request.user.client
        if logged_in_doctor != appointment.client:
            return Response({'detail': 'You do not have permission to approve this appointment.'}, status=403)

        # Update the appointment status to 'approved'
        appointment.status = 'canceled'
        appointment.save()

        # client_email = appointment.client.email
        # subject = 'Appointment Approved'
        # message = 'Your appointment has been approved.'
        # send_mail('Appointment Approved', 'Your appointmetn has been approved.', 'settings.EMAIL_HOST_USER', [client_email])

        serializer = self.get_serializer(appointment)
        return Response(serializer.data)