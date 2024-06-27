from django import forms
from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpRequest
from django.views import View
from rest_framework import status

from .domain.accomodation import get_accommodation, create_or_update_accommodation
from .domain.activity import get_activities_by_date, create_or_update_activity
from .domain.expense import get_expenses_for_date
from .domain.trip import update_trip, get_trip, create_trip
from .models import DayItinerary, Trip, Activity, CONFIRMATION_STATUS_VALS, Accommodation


def exception_handling_view(func):
    def inner(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            return JsonResponse(data={
                'error': str(e),
            }, status=400)
        except Exception as e:  # TODO - throw exception if in debug mode?
            return JsonResponse(data={
                'error': str(e),
            }, status=500)

    return inner


# Mixins

class APIMixinView():
    NO_UPDATE_RESPONSE = JsonResponse(data={
        'message': 'No updates made',
    }, status=status.HTTP_200_OK)

    def validate_param(self, form_field: forms.Field, field_name: str, val):
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
    # TODO - UpdateTripDatesAPI
    @exception_handling_view
    def post(self, request: HttpRequest, *args, **kwargs):
        trip_id = request.POST.get('trip_id')
        name = request.POST.get('name')
        trip = update_trip(trip_id, name)
        return JsonResponse(data={
            'id': trip.pk,
            'name': trip.name,
            'start_date': trip.start_date,
            'end_date': trip.end_date
        }, status=status.HTTP_200_OK)


class GetTripView(View, APIMixinView):
    # @exception_handling_view
    def get(self, request: HttpRequest, trip_id, *args, **kwargs):
        trip = get_trip(trip_id)
        return JsonResponse(data={
            'id': trip.pk,
            'name': trip.name,
            'start_date': trip.start_date,
            'end_date': trip.end_date
        }, status=status.HTTP_200_OK)


class CreateTripView(View, APIMixinView):
    @exception_handling_view
    # Create Trip
    def post(self, request: HttpRequest, *args, **kwargs):
        params = request.POST
        name = params.get('name')
        start_date = params.get('start_date')
        end_date = params.get('end_date')

        trip = create_trip(name, start_date, end_date)['trip']
        return JsonResponse(data={
            'id': trip.pk,
            'name': trip.name,
            'start_date': trip.start_date,
            'end_date': trip.end_date
        })


# TODO - DayItineraryAPIs: get costs (add costs here too.)
class DayItineraryView(View, APIMixinView):

    # trip_id - PK for Trip
    # day - string formatted day YYYY-MM-DD

    @exception_handling_view
    def get(self, request: HttpRequest, *args, **kwargs):
        trip_id = kwargs.get('trip_id')
        day = kwargs.get('day')

        return self.exception_handling_method(self._get_day_itinerary, request, trip_id, day)

    def post(self, request: HttpRequest, trip_id, day, *args, **kwargs):
        trip_id = request.POST.get('trip_id')
        day = request.POST.get('day')
        notes = request.POST.get('notes')
        name = request.POST.get('name')

        return self.exception_handling_method(self._edit_day_itinerary, request, trip_id, day, name, notes)

    # TODO - need to refactor this to reduce duplication across conditionals.
    def _get_day_itinerary(self, request: HttpRequest, trip_id, day):

        # Field validation
        trip_id = self.validate_param(forms.IntegerField(), 'trip_id', trip_id)
        day_date = self.validate_param(forms.DateField(required=False), 'day', day)

        # Return all days for trip
        if not day_date:
            days = DayItinerary.objects.filter(trip_id__exact=trip_id).order_by('date').all()
            return JsonResponse(data={'days': [
                {
                    'trip_id': day.trip_id,
                    'name': day.name,
                    'date': day.date,
                    'notes': day.notes,
                    'expenses': [],
                    # TODO - costs
                } for day in days
            ]}, status=status.HTTP_200_OK)

        # Get by single day
        day = DayItinerary.objects.filter(trip_id__exact=trip_id, date__exact=day_date).first()
        if not day:
            raise Exception("Day does not exist - {}".format(day_date))

        # print(day_date, day.date)
        activities = Activity.objects.filter(trip_id__exact=trip_id, date__exact=day_date).all()
        # print(activities.query)

        # Only handle first accommodation
        accommodation = get_accommodation(trip_id=trip_id, date=day_date)
        if len(accommodation) > 1:
            raise ValidationError("Too many accommodations!")
        elif len(accommodation) == 1:
            accommodation = accommodation[0]
        else:
            accommodation = None


        expenses = get_expenses_for_date(trip_id, day_date)
        print(expenses)

        return JsonResponse(data={
            'trip_id': day.trip_id,
            'name': day.name,
            'date': day.date,
            'notes': day.notes,
            'activities': [ActivityView.map_activity(a) for a in activities],
            'accommodation': AccommodationView.map_accommodation(accommodation),
            'expenses': {
                'total_expense': sum({e.cost for e in expenses}) + (accommodation.avg_cost_per_day() or 0),  # TODO - add accom cost
                'accommodation_expense': {  # TODO
                    'total_expense': accommodation.cost,
                    'number_of_nights': accommodation.num_booked_days(),
                    'expense_per_night': accommodation.avg_cost_per_day(),
                } if accommodation else None,
                'other_expenses': [{
                    'id': e.id,
                    'name': e.name,
                    'date': e.date,
                    'type': e.cost_type,
                    'notes': e.notes,
                    'cost': e.cost,
                    'currency': e.currency,
                    'activityId': e.activity_id,
                } for e in expenses]

            }
        })

    def _edit_day_itinerary(self, request: HttpRequest, trip_id, day, name, notes):
        # Field validation
        trip_id = self.validate_param(forms.IntegerField(), 'trip_id', trip_id)
        day_date = self.validate_param(forms.DateField(), 'day', day)
        name = self.validate_param(forms.CharField(), 'name', name)
        notes = self.validate_param(forms.CharField(), 'notes', notes)

        day = DayItinerary.objects.filter(trip_id__exact=trip_id, date__exact=day_date).first()
        if not day:
            raise ValidationError("Day does not exist - {}".format(day_date))

        # Update fields
        if name is not None:
            day.name = name

        if notes is not None:
            day.notes = notes

        day.save()
        return JsonResponse(data={
            'date': day.date,
            'name': day.name,
            'notes': day.notes,
        }, status=status.HTTP_200_OK)


class ActivityView(View, APIMixinView):

    @staticmethod
    def map_activity(activity: Activity):
        return {
            'id': activity.id,
            'name': activity.name,
            'country': activity.country,
            'city': activity.city,
            'address': activity.address,
            'status': activity.status,
            'notes': activity.notes,
            'date': activity.date,
            'time': activity.time,
            'trip': activity.trip_id,
        }

    @exception_handling_view
    def get(self, request: HttpRequest, *args, **kwargs):
        trip_id = kwargs.get('trip_id')
        day = kwargs.get('day')
        activities = get_activities_by_date(trip_id, day)
        return JsonResponse(data={'activities': [self.map_activity(activity) for activity in activities]},
                            status=status.HTTP_200_OK)

    def post(self, request: HttpRequest, *args, **kwargs):
        trip_id = request.POST.get('trip_id')
        activity_id = request.POST.get('activity_id')

        name = request.POST.get('name')
        country = request.POST.get('country')
        city = request.POST.get('city')
        address = request.POST.get('address')
        status = request.POST.get('status')
        notes = request.POST.get('notes')
        date = request.POST.get('date')
        time = request.POST.get('time')

        # Create activity
        activity = None
        if not activity_id:
            return self.exception_handling_method(self._create_activity, request, activity_id)

        # Edit activity
        else:
            activity = create_or_update_activity(trip_id, name, country, city, address, status, notes,
                                                 date, time, activity_id=activity_id)

        return JsonResponse(data=self.map_activity(activity), status=status.HTTP_200_OK)

    # TODO - need end time of activity?
    @exception_handling_view
    def _create_activity(self, request: HttpRequest, trip_id, name, country, city, address, status, notes, date, time):
        # Validation
        trip_id = self.validate_param(forms.IntegerField(), 'trip_id', trip_id)
        date = self.validate_param(forms.DateField(), 'date', date)
        name = self.validate_param(forms.CharField(), 'name', name)
        country = self.validate_param(forms.CharField(), 'country', country)
        city = self.validate_param(forms.CharField(), 'city', city)

        time = self.validate_param(forms.TimeField(required=False), 'time', time)  # TODO - need to understand format
        address = self.validate_param(forms.CharField(required=False), 'address', address)
        status = self.validate_param(forms.CharField(required=False), 'status', status)  # TODO - validate choices
        notes = self.validate_param(forms.CharField(required=False), 'notes', notes)

        trip = Trip.objects.get(id=trip_id)
        if date < trip.start_date or date > trip.end_date:
            raise ValidationError("Date must be between {} and {}".format(trip.start_date, trip.end_date))

        if status not in CONFIRMATION_STATUS_VALS.keys():  # TODO - not sure this works yet
            raise ValidationError("Status is invalid")

        # Create activity and save
        activity = Activity(
            trip_id=trip_id,
            date=date,
            name=name,
            country=country,
            city=city,
            time=time,
            address=address,
            status=status,
            notes=notes,
        )
        activity.save()

        return JsonResponse(data=self.map_activity(activity), status=status.HTTP_201_CREATED)

    # Must send all fields - always get overridden.
    @exception_handling_view
    def _edit_activity(self, request: HttpRequest, trip_id, activity_id, name, country, city, address, status, notes,
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

        return JsonResponse(data=self.map_activity(activity), status=status.HTTP_200_OK)


class AccommodationView(View, APIMixinView):

    @staticmethod
    def map_accommodation(accommodation: Accommodation):
        return {
            'id': accommodation.id,
            'trip_id': accommodation.trip_id,
            'name': accommodation.name,
            'country': accommodation.country,
            'city': accommodation.city,
            'address': accommodation.address,
            'status': accommodation.status,
            'notes': accommodation.notes,
            'cost': accommodation.cost,
            'currency': accommodation.currency,
            'checkin_date': accommodation.checkin_date,
            'checkout_date': accommodation.checkout_date,
            'checkin_time': accommodation.checkin_time,
            'checkout_time': accommodation.checkout_time,
        }

    def get(self, request: HttpRequest, *args, **kwargs):
        trip_id = kwargs.get('trip_id')
        accommodation_id = kwargs.get('accommodation_id')
        date = request.GET.get('date')
        accommodations = get_accommodation(trip_id, accommodation_id=accommodation_id, date=date)
        return JsonResponse(data=[self.map_accommodation(a) for a in accommodations],
                            status=status.HTTP_200_OK)

    def post(self, request: HttpRequest, *args, **kwargs):
        trip_id = request.POST.get('trip_id')
        accommodation_id = request.POST.get('accommodation_id')
        name = request.POST.get('name')
        country = request.POST.get('country')
        city = request.POST.get('city')
        address = request.POST.get('address')
        notes = request.POST.get('notes')
        status = request.POST.get('status')
        cost = request.POST.get('cost')
        currency = request.POST.get('currency')
        checkin_date = request.POST.get('checkin_date')
        checkout_date = request.POST.get('checkout_date')
        checkin_time = request.POST.get('checkin_time')
        checkout_time = request.POST.get('checkout_time')

        accommodation = create_or_update_accommodation(trip_id, name, country, city, address, notes, status, cost,
                                                       currency, checkin_date, checkout_date, checkin_time,
                                                       checkout_time, accommodation_id)
        return JsonResponse(data=self.map_accommodation(accommodation), status=status.HTTP_201_CREATED)

# TODO - DayCostAPI - CRUD

# TODO - CostsDashboardAPI
# - Current total spend
# - accomodation spend / day (only booked accom)
# - food spend / day
# - trabel spend / day
# - Remaining budget (optional)
