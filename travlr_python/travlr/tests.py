from django.test import TestCase

class ApiTests(TestCase):
    def test_cors_enabled(self):
        """Make sure CORS is enabled a given endpoint
        # Technique inspired from https://stackoverflow.com/a/47609921
        """
        request_headers = {
            "HTTP_ACCESS_CONTROL_REQUEST_METHOD": "GET",
            "HTTP_ORIGIN": "http://somethingelse.com",
        }
        response = self.client.get(
            "/api/trip/1/", {}, **request_headers
        )
        self.assertEqual(response.headers["Access-Control-Allow-Origin"], "x")