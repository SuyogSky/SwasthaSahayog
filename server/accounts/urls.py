from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from . import views


urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('verify-otp/', views.VerifyOtp.as_view()),

    path('register/client', views.NewRegisterView.as_view(), name='auth_register'),
    path('register/doctor', views.NewDoctorRegisterView.as_view(), name='auth_register'),
    path('register/pharmacist', views.NewPharmacistRegisterView.as_view(), name='auth_register'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),

    path('verified-doctors/', views.VerifiedDoctorListView.as_view(), name='doctors'),
    path('verified-pharmacies/', views.VerifiedPharmacyListView.as_view(), name='pharmacies'),
    path('edit-doctor-profile/<int:user_id>/', views.DoctorProfileEditView.as_view(), name='update_profile'),
    path('edit-pharmacist-profile/<int:user_id>/', views.PharmacistProfileEditView.as_view(), name='update_pharmacist_profile'),
    path('edit-medical-background/<int:user_id>/', views.MedicalBackgroundEditView.as_view(), name='update_medical_background'),
    path('edit-others-details/<int:user_id>/', views.OthersDetailsEditView.as_view(), name='update_others_details'),
    path('doctors/<int:pk>/update_clinic_location/', views.ClinicLocationUpdateAPIView.as_view(), name='update_clinic_location'),
    path('pharmacists/<int:pk>/update_pharmacy_location/', views.PharmacyLocationUpdateAPIView.as_view(), name='update_clinic_location'),

    # Profile view
    path('user/<int:id>/', views.UserDetails.as_view(), name='user-detail'),
    path('client-profile/<int:id>/', views.ClientDetailView.as_view(), name='client-detail'),
    path('doctor-profile/<int:id>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('pharmacist-profile/<int:id>/', views.PharmacistDetailView.as_view(), name='pharmacist-detail'),
    path('update-bio/<int:user_id>/', views.UpdateBioView.as_view(), name='update_bio'),
    path('update-picture/<int:user_id>/', views.UpdateProfilePictureView.as_view(), name='update_picture'),
    path('edit-client-profile/<int:user_id>/', views.ClientProfileEditView.as_view(), name='update_profile'),
    
    path('all-doctors/', views.AllDoctorListView.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/verify/', views.DoctorVerificationView.as_view(), name='doctor-verification'),

    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes),
]