from django.db import models



CONFIRMATION_STATUS_VALS = {
    'C': 'Confirmed',  # Booking or equiv confirmed for day
    'D': 'Done',  # Activity completed
    'X': 'Cancelled',  # Activity cancelled or did not go ahead
    'I': 'Idea'  # Idea for a potential activity
}


# Models #

class Trip(models.Model):
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()



class DayItinerary(models.Model):
    # Nane of the day, will be auto suggestted based on activities and accom.
    name = models.CharField(max_length=200) 
    date = models.DateField()
    notes = models.TextField()

    # TODO - helpers to get all activities, costs, accomodations
    # TODO - accom can have multiple potentially, so let's keep it as a query instead of fully mapped.


class Activity(models.Model):
    name = models.CharField(max_length=200) 
    country = models.CharField(max_length=200) 
    city = models.CharField(max_length=200) 
    address = models.CharField(max_length=500)
    
    status = models.CharField(max_length=3, choices=CONFIRMATION_STATUS_VALS)
    notes = models.TextField()
    
    # TODO - timezones?
    date = models.DateField()
    time = models.TimeField()  # Optional time for activity
    day_itinerary = models.ForeignKey(DayItinerary, null=True, on_delete=models.SET_NULL)

    # TODO method to get costs


class Accomodation(models.Model):
    name = models.CharField(max_length=200) 
    country = models.CharField(max_length=200) 
    city = models.CharField(max_length=200) 
    address = models.CharField(max_length=500)
    notes = models.TextField()
    status = models.CharField(max_length=3, choices=CONFIRMATION_STATUS_VALS)
    
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=2)  # TODO

    # TODO - timezones?
    checkin_date = models.DateField()
    checkin_time = models.TimeField()
    checkout_date = models.DateField()
    checkout_time = models.TimeField()


# Adhoc costs during the trip
class DayCost(models.Model):

    COST_TYPES = {
        'O': 'Other',
        'F': 'Food / Drinks',
        'ATV': 'Activity',
        'T': ' Transport',
        'S': 'Shopping',
        'ACC': 'Accomodation',
    }

    name = models.CharField(max_length=200) 
    date = models.DateField()
    cost_type = models.CharField(max_length=3, choices=COST_TYPES)
    notes = models.TextField()
    
    activity = models.ForeignKey(Activity, null=True, on_delete=models.SET_NULL)

    cost = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=2)  # TODO
