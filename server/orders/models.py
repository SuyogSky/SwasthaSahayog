from django.db import models
from accounts.models import Client, Pharmacist
from django.conf import settings

# Create your models here.
class MedicineOrders(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='client_order')
    pharmacy = models.ForeignKey(Pharmacist, on_delete=models.CASCADE, related_name = 'pharmacist_order')
    date = models.DateTimeField(auto_now=True)

    medicine_description = models.TextField(null=True, blank=True)
    medicine_description_image = models.ImageField(null=True, blank=True)
    order_description = models.TextField(null=True, blank=True)
    order_location = models.CharField(max_length=100)