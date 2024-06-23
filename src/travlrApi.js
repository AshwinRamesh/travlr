
class TravlrApi {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getTrip(id) {
    return fetch(this.baseUrl + "/api/trip/" + id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to get Trip with id: ' + id);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
        });
  }

  getTripAccommodations(id) {
    return null;
  }

  getTripItinerary(id) {
    return  null;
  }

}


export const travlrApiClient = new TravlrApi("http://127.0.0.1:8000")
//export {TravlrApi};