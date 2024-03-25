from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
import os
import uuid
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings



def user_image_path(instance, filename):
    return os.path.join("user_images", f"{slugify(instance.email)}_{filename}")

def client_report_path(instance, filename):
    return os.path.join("reports", f"{slugify(instance.email)}_{filename}")

def license_image_path(instance, filename):
    return os.path.join("doctor_license", f"{slugify(instance.email)}_{filename}")

def pharmacy_license_path(instance, filename):
    return os.path.join("pharmacy_license", f"{slugify(instance.email)}_{filename}")

class BaseUser(AbstractUser):
    username = models.CharField(max_length=150, unique=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=100)
    image = models.ImageField(upload_to=user_image_path, blank=True, null=True, default='user_images/default.jpg')
    bio = models.TextField(max_length=200, blank=True, null=True)
    
    USER_TYPES = (
        ('client', 'Client'),
        ('doctor', 'Doctor'),
        ('pharmacist', 'Pharmacist'),
    )
    role = models.CharField(max_length=20, choices=USER_TYPES)

    is_email_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Client(BaseUser):
    gender = models.CharField(max_length=10, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]

    blood_group = models.CharField(max_length=10, choices=BLOOD_GROUP_CHOICES,  null=True, blank=True)
    class Meta:
        verbose_name = "Client"
        verbose_name_plural = "Clients"
    
    def __str__(self):
        return self.email
    

class Doctor(BaseUser):
    clinic_location = models.CharField(max_length=200, null=True, blank=True)#
    medical_license = models.ImageField(upload_to=license_image_path, null=True, blank=True)#
    opening_time = models.TimeField(blank=True, null=True)
    closing_time = models.TimeField(blank=True, null=True)
    service_charge = models.IntegerField(blank=True, null=True)
    speciality = models.CharField(max_length=100, blank=True, null=True)
    home_checkup_service = models.BooleanField(default=False, null=True, blank=True)#
    medical_background = models.TextField(max_length=300, blank=True, null=True)#
    is_verified = models.BooleanField(default=False)

    # region_of_service, medical_license, , 

    DURATIONS = [
        (10, 10),
        (20, 20),
        (30, 30),
        (40, 40),
        (50, 50),
        (60, 60),
    ]
    appointment_duration = models.IntegerField(default=30, choices=DURATIONS)
    
    class Meta:
        verbose_name = "Doctor"
        verbose_name_plural = "Doctors"

    def __str__(self):
        return self.email


class Pharmacist(BaseUser):
    opening_hours = models.CharField(max_length=100)
    delivery_service = models.BooleanField(default=False)
    pharmacy_license = models.ImageField(upload_to=pharmacy_license_path)

    class Meta:
        verbose_name = "Pharmacist"
        verbose_name_plural = "Pharmacists"

    def __str__(self):
        return self.email