from django import forms

from ..models import Activity


def create_activity():
    pass

def get_activities_by_date(trip_id, date):

    pass


def update_activity(self, trip_id, activity_id, name, country, city, address, status, notes,
                       date, time):
        # Validation
        trip_id = self.validate_param(forms.IntegerField(), 'trip_id', trip_id)
        activity_id = self.validate_param(forms.IntegerField(), 'activity_id', activity_id)
        date = self.validate_param(forms.DateField(), 'date', date)
        name = self.validate_param(forms.CharField(), 'name', name)
        country = self.validate_param(forms.CharField(), 'country', country)
        city = self.validate_param(forms.CharField(), 'city', city)

        time = self.validate_param(forms.TimeField(required=False), 'time', time)  # TODO - need to understand format
        address = self.validate_param(forms.CharField(required=False), 'address', address)
        status = self.validate_param(forms.CharField(required=False), 'status', status)  # TODO - validate choices
        notes = self.validate_param(forms.CharField(required=False), 'notes', notes)

        activity = Activity.objects.filter(id=activity_id, trip_id__exact=trip_id).get()
        activity.date = date
        activity.time = time
        activity.name = name
        activity.country = country
        activity.city = city
        activity.address = address
        activity.status = status
        activity.notes = notes
        activity.save()

        return activity