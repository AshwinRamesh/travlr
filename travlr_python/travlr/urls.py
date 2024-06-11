from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    # Trip APIs
    path('trip/<int:trip_id>/', csrf_exempt(views.GetTripView.as_view()), name='trip-update'),
    path('trip/create/', csrf_exempt(views.CreateTripView.as_view()), name='trip-create'),
    path('trip/update/', csrf_exempt(views.EditTripView.as_view()), name='trip-update'),

    # Day APIs
    path('trip/<int:trip_id>/day/<str:day>/', csrf_exempt(views.DayItineraryView.as_view()), name='day-update'),
]