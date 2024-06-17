from datetime import timedelta

from django import forms
from django.core.exceptions import ValidationError
from django.db import transaction

from .validation import validate_param
from ..models import Trip, DayItinerary


def create_trip(name, start_date, end_date):
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
        days = []
        for i in range(time_delta.days + 1):
            day = DayItinerary(name="TBD", trip=trip, date=start_date + timedelta(days=i), notes="")
            day.save()
    return {
        'trip': trip,
        'days': days
    }


def update_trip(trip_id, name):  # TODO - allow to edit dates, "delete"
    trip_id = validate_param(forms.IntegerField(), 'trip_id', trip_id)
    name = validate_param(forms.CharField(), 'name', name)

    if name is None:
        raise ValidationError("Atleast on of the following fields need to have a change - 'name'")

    trip = Trip.objects.get(pk=trip_id)
    trip.name = name
    trip.save()
    return trip


def get_trip(trip_id):
    trip_id = validate_param(forms.IntegerField(), 'trip_id', trip_id)
    return Trip.objects.get(pk=trip_id)
