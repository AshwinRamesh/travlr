from django.core.management.base import BaseCommand
import csv
import requests
from ...domain import trip as trip_domain
from ...domain import accomodation as accommodation_domain
from ...models import CONFIRMED


class Command(BaseCommand):

    trip_name = 'Ash & Em - 2024'
    start_date = '2024-05-25'
    end_date = '2024-11-30'
    csvUrlForItinerary = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=1411334035&single=true&output=csv';
    csvUrlForAccommodation = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=727628574&single=true&output=csv';

    help = 'Import from google sheets.'

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
                if row[0] != 'TRUE':
                    continue


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
                    notes=None, # TODO
                    status=CONFIRMED,
                    cost=row[11][1],
                    currency='AUD',
                    checkin_date="{}-{}-{}".format(checkin_date_split[2], checkin_date_split[0], checkin_date_split[1]),
                    checkout_date="{}-{}-{}".format(checkout_date_split[2], checkout_date_split[0], checkout_date_split[1]),
                    checkin_time=None,
                    checkout_time=None,
                )
                print(accom.name)

        # TODO - iterate through costs file and add

