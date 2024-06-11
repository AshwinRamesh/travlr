from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path('trip/create/', views.TripCreateView.as_view(), name='trip-create'),
    path('trip/<int:pk>/update/', views.TripUpdateView.as_view(), name='trip-update'),
    path('trip/<int:pk>/', views.TripGetView.as_view(), name='trip-get'),

    path('trip2/create/', views.TripApiCreateView.as_view(), name='trip-create2'),

    # New APIS
    path('trip3/<int:trip_id>/', csrf_exempt(views.GetTripView.as_view()), name='trip-update3'),
    path('trip3/create/', csrf_exempt(views.CreateTripView.as_view()), name='trip-create3'),
    path('trip3/update/', csrf_exempt(views.EditTripView.as_view()), name='trip-update3'),
]