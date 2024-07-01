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

  getTripItineraryForDate(id, date) {
    console.log(id, date);
    return fetch(this.baseUrl + "/api/trip/" + id + "/day/" + date)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to get Trip Itinerary with id: ' + id + ' and date ' + date);
        }
        const resp = response.json();
        console.log(id, date, resp);
        return resp;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  createExpense(tripId, date, name, cost) {
    console.log("Create Expense Data:", tripId, date, name, cost);
    return fetch(this.baseUrl + "/api/trip/expense/create", {
      method: "POST",
      body: JSON.stringify({
        trip_id: tripId,
        date: date,
        name: name,
        cost: cost,
      })
    }).then(r => {
      if (!r.ok) {
        throw new Error('Failed to create new Expense');
      }
      const resp = r.json();
      console.log(resp);
      return resp;
    }).catch(e => {
      console.error('Error:', e);
    });

  }
}


export const travlrApiClient = new TravlrApi("http://127.0.0.1:8000");