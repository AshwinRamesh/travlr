from datetime import timedelta

from django.core.exceptions import ValidationError
from django.shortcuts import render
from rest_framework import serializers, generics
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.http import JsonResponse, HttpRequest
from django import forms
from django.views import View

from .models import DayItinerary, Trip
from django.views.decorators.http import require_http_methods


# Mixins

class APIMixinView():

    NO_UPDATE_RESPONSE = JsonResponse(data={
        'message': 'No updates made',
    }, status=status.HTTP_200_OK)

    def exception_handling_method(self, method, *args, **kwargs):
        try:
            return method(*args, **kwargs)
        except ValidationError as e:
            return JsonResponse(data={
                'error': str(e),
            }, status=400)
        except Exception as e:  # TODO - throw exception if in debug mode?
            return JsonResponse(data={
                'error': str(e),
            }, status=500)


# Basic views here

class EditTripView(View, APIMixinView):

    def post(self, request: HttpRequest, *args, **kwargs):
        trip_id = request.POST.get('trip_id')
        name = request.POST.get('name')
        return self.exception_handling_method(self._edit_trip, trip_id, name)

    # TODO - allow to edit dates, "delete"
    def _edit_trip(self, request: HttpRequest, trip_id, name=None):
        trip_id = forms.IntegerField().clean(trip_id)
        name = forms.CharField(required=False).clean(name)

        if name is None:
            raise ValidationError("Atleast on of the following fields need to have a change - 'name'")

        trip = Trip.objects.get(pk=trip_id)
        trip.name = name
        trip.save()

        return JsonResponse(data={
            'id': trip.pk,
            'name': trip.name,
            'start_date': trip.start_date,
            'end_date': trip.end_date
        }, status=status.HTTP_200_OK)

class GetTripView(View, APIMixinView):
    def get(self, request: HttpRequest, *args, **kwargs):
        pk = request.GET.get('pk')
        return self.exception_handling_method(self._get_trip_by_id, request, pk)

    def _get_trip_by_id(self, request, trip_id):
        trip_id = forms.IntegerField().clean(trip_id)
        trip = Trip.objects.get(pk=pk)
        return JsonResponse(data={
            'id': trip.pk,
            'name': trip.name,
            'start_date': trip.start_date,
            'end_date': trip.end_date
        }, status=status.HTTP_200_OK)

class CreateTripView(View, APIMixinView):

    # Create Trip
    def post(self, request: HttpRequest, *args, **kwargs):
        params = request.POST
        name = params.get('name')
        start_date = params.get('start_date')
        end_date = params.get('end_date')
        return self.exception_handling_method(self._create_trip, request, name, start_date, end_date)

    def _create_trip(self, request, name, start_date, end_date):

        # TODO add field validation

        if end_date <= start_date:
            raise forms.ValidationError('end_date must be > start_date')

        with transaction.atomic():
            trip = Trip(name=name, start_date=start_date, end_date=end_date)
            trip.save()

            time_delta = end_date - start_date
            for i in range(time_delta.days + 1):
                day = DayItinerary(name="TBD", trip=trip, date=start_date + timedelta(days=i), notes="")
                day.save()

            return JsonResponse(data={
                'id': trip.pk,
                'name': trip.name,
                'start_date': trip.start_date,
                'end_date': trip.end_date
            })


# DRF views below

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'


class TripApiCreateView(generics.GenericAPIView):
    serializer_class = TripSerializer
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        # Validate
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        # TODO - validate dates are correct

        # Create Data
        with transaction.atomic():
            trip = Trip(name=validated_data['name'],
                        start_date=validated_data['start_date'],
                        end_date=validated_data['end_date'])

            start_date = validated_data['start_date']
            end_date = validated_data['end_date']
            time_delta = end_date - start_date
            trip.save()

            for i in range(time_delta.days + 1):
                day = DayItinerary(name="TBD", trip=trip, date=start_date + timedelta(days=i), notes="")
                day.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)


# TODO - this should also create all the days in the trip.
class TripCreateView(generics.CreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    http_method_names = ['post', ]


class TripGetView(generics.RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    http_method_names = ['get', ]


class TripUpdateView(generics.UpdateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    http_method_names = ['put', ]

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, partial=True, **kwargs)

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
