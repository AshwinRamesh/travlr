from django.core.management.base import BaseCommand
import csv
import requests


class Command(BaseCommand):

    start_date = '05-25-2024'
    end_date = '11-30-2024'
    csvUrlForItinerary = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=1411334035&single=true&output=csv';
    csvUrlForAccommodation = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=727628574&single=true&output=csv';

    help = 'Import from google sheets.'

    def handle(self, *args, **kwargs):

        # TODO - create a trip with dates
        trip =
        # TODO - iterate through accom file and add
        # TODO - iterate through activity file and add
        # TODO - iterate through costs file and add

        with requests.Session() as s:
            download = s.get(self.csvUrlForItinerary)

            decoded_content = download.content.decode('utf-8')

            cr = csv.reader(decoded_content.splitlines(), delimiter=',')
            my_list = list(cr)
            for row in my_list:
                print(row)