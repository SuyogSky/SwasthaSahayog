from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from . import views


urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('register/', views.RegisterView.as_view(), name='auth_register'),

    path('verify-otp/', views.VerifyOtp.as_view()),
    # Registration paths
    # path('register/client', views.ClientRegisterView.as_view(), name='auth_register'),
    path('register/client', views.NewRegisterView.as_view(), name='auth_register'),
    path('register/doctor', views.DoctorRegisterView.as_view(), name='auth_register'),
    path('register/pharmacist', views.PharmacistRegisterView.as_view(), name='auth_register'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),

    path('verified-doctors/', views.VerifiedDoctorListView.as_view(), name='doctors'),
    path('edit-doctor-profile/<int:user_id>/', views.DoctorProfileEditView.as_view(), name='update_profile'),
    path('edit-medical-background/<int:user_id>/', views.MedicalBackgroundEditView.as_view(), name='update_medical_background'),
    path('doctors/<int:pk>/update_clinic_location/', views.ClinicLocationUpdateAPIView.as_view(), name='update_clinic_location'),

    # Profile view
    path('user/<int:id>/', views.UserDetails.as_view(), name='user-detail'),
    path('client-profile/<int:id>/', views.ClientDetailView.as_view(), name='client-detail'),
    path('doctor-profile/<int:id>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('update-bio/<int:user_id>/', views.UpdateBioView.as_view(), name='update_bio'),
    path('update-picture/<int:user_id>/', views.UpdateProfilePictureView.as_view(), name='update_picture'),
    path('edit-client-profile/<int:user_id>/', views.ClientProfileEditView.as_view(), name='update_profile'),
    


    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes),
]