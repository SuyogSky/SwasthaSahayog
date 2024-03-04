from django.db import models
from accounts.models import BaseUser

# Create your models here.
class ChatMessage(models.Model):
    user = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name="user")
    sender = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name="sender")
    reciever = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name="reciever")

    message = models.TextField(max_length=1000)
    is_read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering =  ['date']
        verbose_name_plural = 'Message'

    def __str__(self):
        return f"{self.sender} - {self.reciever}"