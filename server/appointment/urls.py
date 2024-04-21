from django.urls import path
from appointment.views import *

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='book-appointment'),
    path('approved_appointment_times/', ApprovedAppointmentTimeListView.as_view(), name='approved_appointment_times'),
    path('doctor-appointments/', DoctorAppointmentsListView.as_view(), name='doctor-appointments'),
    path('client-appointments/', ClientAppointmentsListView.as_view(), name='doctor-appointments'),

    path('cancel/<int:pk>', AppointmentCancelView.as_view(), name='approve'),

    path('approve/<int:pk>', AppointmentApprovalView.as_view(), name='approve'),
    path('reject/<int:pk>', AppointmentRejectView.as_view(), name='approve'),
]
