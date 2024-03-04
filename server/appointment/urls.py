from django.urls import path
from appointment.views import *

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='book-appointment'),
    path('doctor-appointments/', DoctorAppointmentsListView.as_view(), name='doctor-appointments'),
    path('client-appointments/', ClientAppointmentsListView.as_view(), name='doctor-appointments'),
    path('approve/<int:pk>', AppointmentApprovalView.as_view(), name='approve'),
]
