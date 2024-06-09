from django.urls import path
from . import views

urlpatterns = [
    path('trip/create/', views.TripCreateView.as_view(), name='trip-create'),
    path('trip/<int:pk>/', views.TripGetView.as_view(), name='trip-get')
]