import './App.css';
import React, {useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import {Activity, Accomodation, TripItinerary} from "./Activity.js";
import {downloadAndParseCSV} from './helpers/downloadGSheet.js';
import {formatDate, formatDateForId, formatDateToHumanReadable, formatStringToDate} from './helpers/dateHelpers.js';
import "react-datepicker/dist/react-datepicker.css";
import {NavBar} from "./components/NavBar";


function generateMapUrl(query) {
  const prefix = "https://www.google.com/maps/search/?api=1&query=";
  return prefix + encodeURIComponent(query);
}


const AccomodationComponent = (props) => {
  const {accomodation} = props;
  if (accomodation) {
    return (
      <div class="rounded bg-glade-green-100 mx-2 px-2 w-full">
        <h2 className='text-lg font-semibold'>🏚️ Accommodation <a href='#' className='text-sm text-blue-700'>(Edit)</a>
        </h2>
        <p className="text-left font-semibold">Name - {accomodation.name}</p>
        <p className='text-left font-semibold'>Address -
          <a className="text-blue-800 font-normal" href={generateMapUrl(accomodation.address)}
             id="mapLink"> {accomodation.address}</a>
        </p>
      </div>
    );
  }
  return (
    <div class="rounded bg-glade-green-200 mx-2 px-2 w-full">
      <h2 className='text-lg font-semibold'>🏚️ Accommodation <a href='#' className='text-sm text-blue-700'>(Add)</a>
      </h2>
      <p>No accommodation booked!</p>
    </div>
  );

}

const ActivityComponent = (props) => {
  const [activity, setActivity] = useState(props.activity);
  const [isCollapsed, setIsCollapsed] = useState(false);


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex mb-2">
      <div className={`w-1/4 flex items-center justify-center ${activity.mapType().color}`}>
        <p className='text-md text-white text-center'>{activity.mapType().emoji}</p>
      </div>

      <div class="w-3/4 p-2">

        <div onClick={toggleCollapse}>
          <span className="text-sm font-bold mb-2">
            {activity.name + " "}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 className={`inline h-4 w-4 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              <path fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414zM10 18a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"/>
            </svg>
          </span>

        </div>

        <div
          className={`text-sm text-left overflow-hidden transition-max-height duration-300 ${isCollapsed ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="px-4 py-2">
            <p class="text-gray-700">Address - {activity.address}</p>
            <p class="text-gray-700">Notes - {activity.details}</p>
          </div>
        </div>

      </div>
    </div>
  )
};


const DayItineraryComponent = (props) => {
  const {dayItinerary} = props;
  const date = formatStringToDate(dayItinerary.date)
  const idName = formatDateForId(date);

  // TODO - On click of calendar, show the calendar.
  return (
    <div id={idName} className='bg-gray-200 rounded-lg shadow-lg pb-2 mb-10'>
      <div className='h-20 bg-glade-green-700 flex rounded-t-lg my-3 items-center'>
        <button className={'pl-5 text-lg'}>⬅️</button>
        <h2 className="text-white text-xl font-bold ml-auto mr-auto">{formatDateToHumanReadable(dayItinerary.date)}
          <pre className={'text-lg'}>
            {dayItinerary.accomodation && dayItinerary.accomodation.city}
            {!dayItinerary.accomodation && "Seoul, Korea"}
          </pre>
        </h2>
        <button className={'pr-5 text-lg'}>➡️</button>
      </div>

      <div className="flex flex-row flex-wrap w-full">
        <AccomodationComponent accomodation={dayItinerary.accomodation}/>
        <div className="rounded px-3 bg-neutral-100 m-2 w-full">
          <h2 className='text-lg font-semibold mb-3'>📚 Itinerary</h2>
          {dayItinerary.activities.length == 0 && <p>No activities planned!</p>}
          {dayItinerary.activities.map(a => {
            return <ActivityComponent activity={a}/>
          })}
        </div>

      </div>
    </div>
  );
}


const MainSection = (props) => {
  const itineraryReal = props.itinerary;
  const selectedDate = formatDate(props.selectedDate);
  const val = itineraryReal.dayItineraries[selectedDate];
  return (
    <div className="mx-auto px-4 h-screen">
      {/* Right column - informational component */}
      <div className="bg-white shadow-md p-4 rounded">
        <DayItineraryComponent dayItinerary={val}/>
      </div>
    </div>
  );
}

function App() {

  // State to store the fetched data
  const [data, setData] = useState(null);
  // State to track loading state
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  var csvUrlForItinerary = "";
  var csvUrlForAccomodation = "";
  if (process.env.REACT_APP_ENV == "dev") {
    csvUrlForItinerary = '/travlr/dev_data/itinerary.csv';
    csvUrlForAccomodation = '/travlr/dev_data/accomodation.csv';
  } else {
    csvUrlForItinerary = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=1411334035&single=true&output=csv';
    csvUrlForAccomodation = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=727628574&single=true&output=csv';
  }

  useEffect(() => {
    var itinerary = new TripItinerary();
    const activitiesCsvPromise = downloadAndParseCSV(csvUrlForItinerary);
    const accomodationCsvPromise = downloadAndParseCSV(csvUrlForAccomodation);

    Promise.all([activitiesCsvPromise, accomodationCsvPromise])
      .then(([activitiesCsv, accomodationCsv]) => {
        console.log("Activities CSV", activitiesCsv);
        console.log("Accomodation CSV", accomodationCsv);

        activitiesCsv.forEach(ra => {
          itinerary.addActivityFromGSheet(ra);
        });

        accomodationCsv.forEach(accom => {
          itinerary.addAccomodationFromGSheet(accom);
        });
        // Set the fetched data in state
        setData(itinerary);
        // Set loading state to false
        setLoading(false);

      });
  }, []);

  // TODO - need to automatically scroll to the right part of the page based on date on first load
  return (
    <div className="App container bg-gray-100 min-h-screen max-w-lg">
      <NavBar selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
      <div className={'mt-20'}>
        <p className={'text-3xl font-bold pb-2'}>Ash & Em - 2024 Trip</p>
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
          <button className="bg-glade-green-500 hover:bg-glade-green-800 text-white font-bold py-2 px-4 rounded">
            📅
          </button>
        </div>
        {loading && <p className='pt:5'>Loading itinerary!</p>}
        {data && (<MainSection itinerary={data} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>)}
      </div>
    </div>
  )
};

export default App;
