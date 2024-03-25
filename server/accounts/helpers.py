import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings


def send_otp_to_email(email, user_obj):
    if cache.get(email):
        return False
    
    try:
        otp_to_send = random.randint(100000, 999999)
        cache.set(email, otp_to_send, timeout=60)
        user_obj.otp = otp_to_send
        user_obj.save()
        subject = 'OTP'
        message = f'This is your OTP {otp_to_send}.'
        email_from = settings.EMAIL_HOST_USER
        receipent_list = [user_obj.email]
        send_mail(subject, message, email_from, receipent_list)
        return True

    except Exception as e:
        print(e)