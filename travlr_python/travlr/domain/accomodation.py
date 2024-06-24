from typing import List

from django.core.exceptions import ValidationError

from .validation import validate_param
from django import forms

from ..models import Accommodation, Trip

"""
Returns a list of all accommodations for a given ID (list of one) or date
"""
def get_accommodation(trip_id, accommodation_id=None, date=None) -> List[Accommodation]:
    accommodation_id = validate_param(forms.IntegerField(required=False),
                                      'accommodation_id', accommodation_id)
    trip_id = validate_param(forms.IntegerField(), 'trip_id', trip_id)
    date = validate_param(forms.DateField(required=False), 'date', date)

    if accommodation_id:
        accommodation = Accommodation.objects.filter(trip_id__exact=trip_id,
                                                     id=accommodation_id).all()
        return list(accommodation)

    elif date:
        accommodation = Accommodation.objects.filter(trip_id__exact=trip_id,
                                                     checkin_date__gte=date,
                                                     checkout_date__lt=date).all()
        return list(accommodation)

    else:
        raise ValidationError('Either `accommodation_id` or `date` need to be given.')


def create_or_update_accommodation(trip_id, name, country, city, address, notes, status, cost,
                                   currency, checkin_date, checkout_date, checkin_time, checkout_time,
                                   accommodation_id=None):
    trip_id = validate_param(forms.IntegerField(), 'trip_id', trip_id)
    accommodation_id = validate_param(forms.IntegerField(required=False), 'accommodation_id', accommodation_id)
    name = validate_param(forms.CharField(), 'name', name)
    country = validate_param(forms.CharField(), 'country', country)
    city = validate_param(forms.CharField(), 'city', city)
    address = validate_param(forms.CharField(required=False), 'address', address)
    notes = validate_param(forms.CharField(required=False), 'notes', notes)
    status = validate_param(forms.CharField(), 'status', status)
    cost = validate_param(forms.DecimalField(required=False), 'cost', cost)
    currency = validate_param(forms.CharField(required=False), 'currency', currency)
    checkin_date = validate_param(forms.DateField(required=False), 'checkin_date', checkin_date)
    checkout_date = validate_param(forms.DateField(required=False), 'checkout_date', checkout_date)
    checkin_time = validate_param(forms.TimeField(required=False), 'checkin_time', checkin_time)
    checkout_time = validate_param(forms.TimeField(required=False), 'checkout_time', checkout_time)

    trip = Trip.objects.get(pk=trip_id)

    accommodation = None
    if accommodation_id:
        accommodation = Accommodation.objects.get(pk=accommodation_id)
    else:
        accommodation = Accommodation()

    accommodation.trip_id = trip_id
    accommodation.accommodation_id = accommodation_id
    accommodation.name = name
    accommodation.country = country
    accommodation.city = city
    accommodation.address = address
    accommodation.notes = notes
    accommodation.status = status
    accommodation.cost = cost  # TODO this should create or update the cost obj
    accommodation.currency = currency
    accommodation.checkin_date = checkin_date  # TODO - need to validate date range
    accommodation.checkout_date = checkout_date  # TODO - need to validate date range
    accommodation.checkin_time = checkin_time
    accommodation.checkout_time = checkout_time

    accommodation.save()
    return accommodation

