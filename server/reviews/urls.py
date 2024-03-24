from django.urls import path
from .views import *

urlpatterns = [
    path('add-review/<int:doctor>/', AddReview.as_view(), name='add-review'),
    path('get-reviews/<int:doctor_id>/', DoctorReviewsListView.as_view(), name='doctor_reviews_list'),
    path('doctor/average-rating/', DoctorWithAverageRatingView.as_view(), name='doctor_average_rating'),
]
