from django import forms
from django.core.exceptions import ValidationError

from .validation import validate_param
from ..models import Activity, Trip, CONFIRMATION_STATUS_VALS


def create_activity():
    pass

def get_activities_by_date(trip_id, date):

    pass


def create_or_update_activity(trip_id, name, country, city, address, status, notes,
                       date, time, activity_id=None):
        # Validation
        trip_id = validate_param(forms.IntegerField(), 'trip_id', trip_id)
        activity_id = validate_param(forms.IntegerField(required=False), 'activity_id', activity_id)
        date = validate_param(forms.DateField(), 'date', date)
        name = validate_param(forms.CharField(), 'name', name)
        country = validate_param(forms.CharField(), 'country', country)
        city = validate_param(forms.CharField(), 'city', city)

        time = validate_param(forms.TimeField(required=False), 'time', time)  # TODO - need to understand format
        address = validate_param(forms.CharField(required=False), 'address', address)
        status = validate_param(forms.CharField(required=False), 'status', status)  # TODO - validate choices
        notes = validate_param(forms.CharField(required=False), 'notes', notes)

        trip = Trip.objects.get(id=trip_id)
        activity = None
        if activity_id:
                activity = Activity.objects.filter(id=activity_id, trip_id__exact=trip_id).get()
        else:
                activity = Activity()

        # Update all fields
        activity.date = date
        activity.time = time
        activity.name = name
        activity.country = country
        activity.city = city
        activity.address = address
        activity.status = status
        activity.notes = notes

        if date < trip.start_date or date > trip.end_date:
            raise ValidationError("Date must be between {} and {}".format(trip.start_date, trip.end_date))

        if status not in CONFIRMATION_STATUS_VALS.keys():  # TODO - not sure this works yet
            raise ValidationError("Status is invalid")

        activity.save()
        return activity