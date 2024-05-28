import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

def send_otp_to_email(email, user_obj):
    if cache.get(email):
        print(cache.get(email))
        return False
    
    try:
        otp_to_send = random.randint(100000, 999999)
        cache.set(email, otp_to_send, timeout=60)
        user_obj.otp = otp_to_send
        user_obj.save()

        subject = 'OTP'
        html_content = """
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
                        <h2 style="color: white;">OTP Email</h2>
                    </div>
                    <div class="content" style="padding: 20px 0; color: black;">
                        <p style="font-size: 22px; font-weight: 500; color: black;">Hello, {user}</p>
                        <p style="font-size: 22px; font-weight: 500; color: black;">Your OTP for authentication is</p>
                        <p class="otp" style="padding: 3px 20px; color: #6aa231; font-size: 24px; font-weight: 500; border: 2px solid #6aa231; background-color: #effce8; width: max-content; margin: 0 auto; border-radius: 6px; cursor: pointer; transition: all 0.3s ease-in-out;">{otp}</p>
                    </div>
                    <br>
                    <div style="background-color: #f4f4f4; padding: 10px; border-radius: 0 0 5px 5px;">
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        """.format(user=user_obj.username, otp=otp_to_send)

        message = EmailMultiAlternatives(subject, '', settings.EMAIL_HOST_USER, [user_obj.email])
        message.attach_alternative(html_content, "text/html")
        message.send()

        return True

    except Exception as e:
        print(e)
