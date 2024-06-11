from datetime import timedelta

from django import forms
from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import JsonResponse, HttpRequest
from django.views import View
from rest_framework import status

from .models import DayItinerary, Trip


# Mixins

class APIMixinView():

    NO_UPDATE_RESPONSE = JsonResponse(data={
        'message': 'No updates made',
    }, status=status.HTTP_200_OK)

    def field_validation_with_better_error_message(self, form_field: forms.Field, field_name: str, val):
        try:
            return form_field.clean(val)
        except ValidationError as e:
            e.message = "{} - {}".format(field_name, e.message)
            raise e

    # TODO - this has a bug where error messages are getting wrapped in list formatting. Not a big deal yet.
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
        return self.exception_handling_method(self._edit_trip, request, trip_id, name)

    # TODO - allow to edit dates, "delete"
    def _edit_trip(self, request: HttpRequest, trip_id, name=None):
        trip_id = self.field_validation_with_better_error_message(forms.IntegerField(), 'trip_id', trip_id)
        name = self.field_validation_with_better_error_message(forms.CharField(), 'name', name)

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
    def get(self, request: HttpRequest, trip_id, *args, **kwargs):
        return self.exception_handling_method(self._get_trip_by_id, request, trip_id)

    def _get_trip_by_id(self, request, trip_id):
        trip_id = self.field_validation_with_better_error_message(forms.IntegerField(), 'trip_id', trip_id)
        trip = Trip.objects.get(pk=trip_id)
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

        # Field validation
        name = forms.CharField().clean(name)
        start_date = forms.DateField().clean(start_date)
        end_date = forms.DateField().clean(end_date)

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
