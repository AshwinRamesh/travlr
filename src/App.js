import './App.css';
import React, {useState, useEffect, forwardRef, useRef} from 'react';
import {Activity, Accomodation, TripItinerary} from "./Activity.js";
import {downloadAndParseCSV} from './helpers/downloadGSheet.js';
import "react-datepicker/dist/react-datepicker.css";
import {NavBar} from "./components/NavBar";
import {CalendarPicker} from "./components/DatePicker";
import {MainSection} from "./components/MainSection";
import {travlrApiClient} from "./travlrApi";

// TODO - move this out of App.js
function validateAndExtractTripIdFromPath(path) {
  const regex = /^\/travlr\/(\d+)$/;
  const match = path.match(regex);
  if (match) {
    return match[1]; // match[1] contains the captured number
  } else {
    return null; // Return null if the path is not valid
  }
}

const appCtx = {
  "currentPage": "itinerary", // One of "itinerary", "add_accom", "add_expense", "add_activity"
  "currentDate": null,
  "selectedDate": null,
}


// TODO - explore having central context object.
function App() {

  // State to store the fetched data
  const [data, setData] = useState(null);
  const [trip, setTrip] = useState(null);
  // State to track loading state
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  var csvUrlForItinerary = "";
  var csvUrlForAccomodation = "";
  if (process.env.REACT_APP_ENV === "dev") {
    csvUrlForItinerary = '/travlr/dev_data/itinerary.csv';
    csvUrlForAccomodation = '/travlr/dev_data/accomodation.csv';
  } else {
    csvUrlForItinerary = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=1411334035&single=true&output=csv';
    csvUrlForAccomodation = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=727628574&single=true&output=csv';
  }

  useEffect(() => {
    var tripId = validateAndExtractTripIdFromPath(window.location.pathname);
    if (tripId === null) {
      tripId = 1; // TODO - remove this and add validation
    }

    var itinerary = new TripItinerary(); // TODO - maybe use "useMemo" to reduce re-rendering. Derived data.
    const activitiesCsvPromise = downloadAndParseCSV(csvUrlForItinerary);
    const accommodationCsvPromise = downloadAndParseCSV(csvUrlForAccomodation);
    const tripDataPromise = travlrApiClient.getTrip(tripId);

    // TODO - why is this calling the APIs twice?
    Promise.all([activitiesCsvPromise, accommodationCsvPromise, tripDataPromise])
      .then(([activitiesCsv, accomodationCsv, tripData]) => {

        activitiesCsv.forEach(ra => {
          itinerary.addActivityFromGSheet(ra);
        });

        accomodationCsv.forEach(accom => {
          itinerary.addAccomodationFromGSheet(accom);
        });

        // Set the fetched data in state
        // TODO - Does making multiple setFoo impact React re-render.
        setTrip(tripData);
        setData(itinerary);
        // Set loading state to false
        setLoading(false); // TODO - remove and use the above variables to infer loading state.

      });
  }, []);
  const calendarRef2 = useRef(null);
// TODO - need to automatically scroll to the right part of the page based on date on first load

  return (
    <div className="App container bg-gray-100 min-h-screen max-w-lg">
      <NavBar/>
      <div id={'page-itinerary'} className={'mt-20'}>
        {/*TODO - is this best practise to check trip then add to div? Why does the FE call API twice? */}
        <p className={'text-3xl font-bold pb-2'}>{trip && trip.name}</p>
        <div className={'mb-3'}>
          <button className="bg-glade-green-500 hover:bg-glade-green-800 text-white text-sm font-bold py-2 px-2 mr-2 rounded">
            Add Expense
          </button>
          <button className="bg-glade-green-500 hover:bg-glade-green-800 text-white text-sm font-bold py-2 px-2 mr-2 rounded">
            Add Activity
          </button>
          <button className="bg-glade-green-500 hover:bg-glade-green-800 text-white text-sm font-bold py-2 px-2 mr-2 rounded">
            Add Accommodation
          </button>
          <button>
            <CalendarPicker ref={calendarRef2} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
          </button>
        </div>
        <div className="mx-auto px-4 h-screen">
          <div className="bg-white shadow-md p-4 rounded">
            {loading ?  <p className='pt:5'>Loading itinerary!</p> : null}
            {data && (<MainSection itinerary={data} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>)}
          </div>
        </div>
      </div>
    </div>
  )
};

export default App;
