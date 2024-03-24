from django.db import models
from django.conf import settings
from accounts.models import Doctor
class Reviews(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="review_doctor")
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviewer')
    ratings = models.IntegerField(null=False, blank=False)
    review = models.TextField(null=False, blank=False)
    date = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.reviewer.username} - {self.doctor.username}"