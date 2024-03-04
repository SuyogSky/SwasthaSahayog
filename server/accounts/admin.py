from django.contrib import admin
from accounts.models import BaseUser, Doctor, Pharmacist, Client

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name' ,'verified']

class DoctorAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

admin.site.register(BaseUser, UserAdmin)
admin.site.register(Doctor)
admin.site.register(Pharmacist)
admin.site.register(Client)