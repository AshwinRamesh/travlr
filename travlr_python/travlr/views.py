from django.shortcuts import render
from rest_framework import serializers, generics

from .models import Trip


class TripSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trip
        fields = '__all__'


# TODO - this should also create all the days in the trip.
class TripCreateView(generics.CreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    http_method_names = ['post',]


class TripGetView(generics.RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    http_method_names = ['get',]
    

# TODO - UpdateTripDatesAPI

# TODO - DayItineraryAPIs: edit notes, edit name of the day, get (add costs here too.)

# TODO - ActivityAPIs - create, edit, delete

# TODO - AccomodationAPI - CRUD

# TODO - DayCostAPI - CRUD

# TODO - CostsDashboardAPI
    # - Current total spend
    # - accomodation spend / day (only booked accom)
    # - food spend / day
    # - trabel spend / day
    # - Remaining budget (optional)
