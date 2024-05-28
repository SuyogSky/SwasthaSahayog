from accounts.models import BaseUser, Client, Doctor, Pharmacist

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.generics import ListAPIView

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from .helpers import *


# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)
        
#         # These are claims, you can add custom claims
#         # token['full_name'] = user.profile.full_name
#         token['username'] = user.username
#         token['email'] = user.email
#         token['role'] = user.role
#         # token['bio'] = user.profile.bio
#         # token['image'] = str(user.profile.image)
#         # token['verified'] = user.profile.verified

#         # if isinstance(user, Client):
#         #     # Add claims for client
#         #     token['role'] = 'client'
#         # elif isinstance(user, Doctor):
#         #     # Add claims for doctor
#         #     token['role'] = 'doctor'
#         # elif isinstance(user, Pharmacist):
#         #     # Add claims for pharmacist
#         #     token['role'] = 'pharmacist'
#         # ...
#         return token


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if not user.is_email_verified:
            raise ValidationError("Email is not verified. Please verify your email.")
        return data
    

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = BaseUser
        fields = ('email', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = BaseUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email']

        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ('id', 'username', 'email', 'phone', 'address', 'image', 'bio', 'role', 'gender', 'date_of_birth', 'blood_group', 'date_joined')

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('id', 'username', 'email', 'phone', 'address', 'image', 'bio', 'role', 'clinic_location', 'medical_license', 'opening_time', 'closing_time', 'service_charge', 'appointment_duration', 'speciality', 'home_checkup_service', 'medical_background', 'date_joined', 'is_verified')

class PharmacistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pharmacist
        fields = ('id', 'username', 'email', 'phone', 'address', 'image', 'bio', 'role', 'pharmacy_location', 'opening_time', 'closing_time', 'delivery_service', 'pharmacy_license', 'date_joined', 'is_verified')


class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ('id', 'username', 'email', 'phone', 'address', 'image', 'bio', 'role', 'date_joined')



class ClientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Client
        fields = ('email', 'username', 'phone' , 'address', 'password', 'password2')

    def validate_email(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError("Please enter a valid email address.")
        
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = Client.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            address=validated_data['address'],
            role='client'
        )

        user.set_password(validated_data['password'])
        user.save()
        send_otp_to_email(user.email, user)

        return user
    

class DoctorRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Doctor
        fields = ('email', 'username', 'phone' , 'address', 'medical_license', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = Doctor.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            address=validated_data['address'],
            medical_license = validated_data['medical_license'],
            role= "doctor",
        )

        user.set_password(validated_data['password'])
        user.save()
        send_otp_to_email(user.email, user)

        return user
    
class PharmacistRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Pharmacist
        fields = ('email', 'username', 'phone', 'address', 'pharmacy_license', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = Pharmacist.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
            phone=validated_data['phone'],
            address=validated_data['address'],
            pharmacy_license=validated_data['pharmacy_license'],
            role='pharmacist'
        )

        user.set_password(validated_data['password'])
        user.save()
        send_otp_to_email(user.email, user)
        return user
    


class ClientProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['username', 'email', 'phone', 'address', 'gender', 'date_of_birth', 'blood_group', 'bio']

class DoctorProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['username', 'email', 'phone', 'address', 'opening_time', 'closing_time', 'service_charge', 'appointment_duration', 'speciality', 'bio']

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser  # Assuming BaseUser is your user model
        fields = ['profile_picture']  # Add other fields if necessary


class VerifiedDoctorListView(ListAPIView):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        return Doctor.objects.filter(is_verified=True)

class VerifiedPharmacyListView(ListAPIView):
    serializer_class = PharmacistSerializer

    def get_queryset(self):
        return Pharmacist.objects.filter(is_verified=True)
    


class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = BaseUser
        fields = ['old_password', 'new_password']

    def update(self, instance, validated_data):
        old_password = validated_data.get('old_password')
        new_password = validated_data.get('new_password')

        # if not instance.check_password(old_password):
            # raise serializers.ValidationError("Old password is incorrect.")

        instance.set_password(new_password)
        instance.save()

        return instance
    

class DoctorVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'is_verified']