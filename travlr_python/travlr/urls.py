from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path('trip/<int:trip_id>/', csrf_exempt(views.GetTripView.as_view()), name='trip-update3'),
    path('trip/create/', csrf_exempt(views.CreateTripView.as_view()), name='trip-create3'),
    path('trip/update/', csrf_exempt(views.EditTripView.as_view()), name='trip-update3'),
]