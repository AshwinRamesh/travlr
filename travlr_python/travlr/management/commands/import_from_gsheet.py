from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand
import csv
import requests
from ...domain import trip as trip_domain
from ...domain import accomodation as accommodation_domain
from ...domain.activity import create_or_update_activity
from ...domain.expense import create_or_update_expense
from ...models import CONFIRMED


# TODO - add ability to delete all rows from existing trip and add all rows.
class Command(BaseCommand):

    trip_name = 'Ash & Em - 2024'
    start_date = '2024-05-25'
    end_date = '2024-11-30'
    csvUrlForItinerary = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=1411334035&single=true&output=csv';
    csvUrlForAccommodation = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=727628574&single=true&output=csv';
    csvUrlForCosts = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=63660410&single=true&output=csv'

    help = 'Import from google sheets.'

    def _convert_date_format(self, date_string):
        split_date = date_string.split('-')
        try:
            return "{}-{}-{}".format(split_date[2], split_date[0], split_date[1])
        except IndexError as e:
            print("Error parsing date `{}`. Skipping and setting as Null".format(date_string))
            return None


    def handle(self, *args, **kwargs):

        # Create a trip with dates
        trip_data = trip_domain.create_trip(self.trip_name, self.start_date, self.end_date)
        trip = trip_data['trip']
        days = trip_data['days']

        # TODO - iterate through activity file and add
        with requests.Session() as s:
            download = s.get(self.csvUrlForItinerary)
            decoded_content = download.content.decode('utf-8')

            cr = csv.reader(decoded_content.splitlines(), delimiter=',')
            my_list = list(cr)
            for row in my_list[1:]:
                date = self._convert_date_format(row[2])
                if row[1] != 'TRUE' or not date or row[6] in ('🏠 Accomodation', 'Check Out', 'Check In'):
                    continue

                try:
                    activity = create_or_update_activity(
                        trip_id=trip.id,
                        name=row[7],
                        country=row[5],
                        city=row[4],
                        address="N/A",
                        status=CONFIRMED,
                        notes=row[8],
                        date=date,
                        time=None,
                    )
                except ValidationError as e:
                    print("Exception raised while processing row: {}\n Skipping!".format(str(row)))
                print(activity)

        # TODO - iterate through accom file and add
        with requests.Session() as s:
            download = s.get(self.csvUrlForAccommodation)

            decoded_content = download.content.decode('utf-8')

            cr = csv.reader(decoded_content.splitlines(), delimiter=',')
            my_list = list(cr)
            for row in my_list[1:]:
                if row[0] != 'TRUE':
                    continue
                checkin_date_split = row[1].split('-')
                checkout_date_split = row[4].split('-')

                accom = accommodation_domain.create_or_update_accommodation(
                    trip_id=trip.id,
                    name=row[9],
                    country=row[8],
                    city=row[7],
                    address=row[10],
                    notes=None,  # TODO
                    status=CONFIRMED,
                    cost=row[11][1:],  # TODO need to create cost row.
                    currency='AUD',
                    checkin_date="{}-{}-{}".format(checkin_date_split[2], checkin_date_split[0], checkin_date_split[1]),
                    checkout_date="{}-{}-{}".format(checkout_date_split[2], checkout_date_split[0], checkout_date_split[1]),
                    checkin_time=None,
                    checkout_time=None,
                )
                print(accom.name)

        # TODO - iterate through costs file and add
        with requests.Session() as s:
            download = s.get(self.csvUrlForCosts)
            decoded_content = download.content.decode('utf-8')

            cr = csv.reader(decoded_content.splitlines(), delimiter=',')
            first_row = False
            for row in cr:
                print(row)
                if not first_row:
                    first_row = True
                    continue
                if not row[0]:  # Skip any rows where the date is empty
                    continue
                date = self._convert_date_format(row[0])

                food_cost = row[2]
                travel_cost = row[3]
                other_cost = row[4]
                notes = row[5]
                costs = [food_cost, travel_cost, other_cost]
                cost_types = ['F', 'T', 'O']

                for _, (cost, cost_type) in enumerate(zip(costs, cost_types)):
                    if not cost:  # Skip empty cost.
                        continue
                    try:
                        c = create_or_update_expense(
                            name="{} Cost for {}".format(cost_type, date),
                            trip_id=trip.id,
                            date=date,
                            cost=cost[1:] if cost else None,
                            cost_type=cost_type,
                            currency='AUD',
                            notes=notes,
                        )
                        print(c)
                    except ValidationError as e:
                        print(e)