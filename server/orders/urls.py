from django.urls import path
from orders.views import *

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order_medicine'),
    path('pharmacy-orders/', PharmacistOrderListView.as_view(), name='pharmacy-orders'),

]