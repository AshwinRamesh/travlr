from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    # Trip APIs
    path('trip/<int:trip_id>/', csrf_exempt(views.GetTripView.as_view()), name='trip-get'),
    path('trip/create/', csrf_exempt(views.CreateTripView.as_view()), name='trip-create'),
    path('trip/update/', csrf_exempt(views.EditTripView.as_view()), name='trip-update'),

    # Day APIs
    path('trip/<int:trip_id>/day/<str:day>/', csrf_exempt(views.DayItineraryView.as_view()), name='day-get-by-date'),
    path('trip/<int:trip_id>/day/', csrf_exempt(views.DayItineraryView.as_view()), name='day-get-all'),
    path('trip/day/update/', csrf_exempt(views.DayItineraryView.as_view()), name='day-update'),

    # Cost/Expense APIs
    path('trip/expense/create',
         csrf_exempt(views.DayCostView.as_view(http_method_names=['post'])), name='expense-create'),


]