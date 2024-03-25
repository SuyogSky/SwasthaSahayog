from django.db import models
from accounts.models import *
from django.conf import settings

# Create your models here.
class Appointment(models.Model):
    # client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointment_clients')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='appointment_clients')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctor')
    date = models.DateField()
    time = models.TimeField()
    comments = models.TextField(max_length=300, null=True, blank=True)

    APPOINTMENT_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    status = models.CharField(max_length=100, choices=APPOINTMENT_STATUS, default='pending')