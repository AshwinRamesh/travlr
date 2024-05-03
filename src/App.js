import './App.css';
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { Activity, Accomodation, TripItinerary } from "./Activity.js";
import { downloadAndParseCSV } from './helpers/downloadGSheet.js';

import "react-datepicker/dist/react-datepicker.css";


function formatDateToHumanReadable(dateString) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [month, day, year] = dateString.split('-');
  const monthName = months[parseInt(month, 10) - 1];

  let daySuffix;
  if (day === '1' || day === '21' || day === '31') {
    daySuffix = 'st';
  } else if (day === '2' || day === '22') {
    daySuffix = 'nd';
  } else if (day === '3' || day === '23') {
    daySuffix = 'rd';
  } else {
    daySuffix = 'th';
  }

  return `${monthName} ${parseInt(day, 10)}${daySuffix}, ${year}`;
}

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const CalendarPicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div >
      <DatePicker className='rounded border-solid border-2 px-2 border-slate-600' selected={startDate} onChange={(date) => setStartDate(date)} />
    </div>

  );
};

function Navbar() {
  return (
    <nav className="bg-glade-green-500 py-4 px-8 flex items-center justify-between">
      <div className="text-white font-bold text-lg">Travlr 🛫</div>
      <ul className="flex space-x-4">
        {/* <li><a href="#" className="text-white hover:text-gray-200">Home</a></li>
    <li><a href="#" className="text-white hover:text-gray-200">About</a></li>
  <li><a href="#" className="text-white hover:text-gray-200">Contact</a></li> */}
        {/* Add more menu items as needed */}
      </ul>
    </nav>
  );
}

const AccomodationComponent = (props) => {
  const { accomodation } = props;
  if (accomodation) {
    return (
      <div class="basis-1/4 rounded bg-glade-green-100 mx-2 px-2 min-h-32 max-h-32">
        <h2 className='text-lg font-semibold'>🏚️ Accomodation</h2>
        <p className="text-left">Name - {accomodation.name}</p>
        <p className='text-left'>Address - {accomodation.address}</p>
      </div>
    );
  }
  return (
    <div class="basis-1/4 rounded bg-glade-green-200 mx-2 px-2 min-h-32 max-h-32">
      <h2 className='text-lg font-semibold'>🏚️ Accomodation</h2>
      <p>No accomodation booked!</p>
    </div>
  );
  
}

const ActivityComponent = (props) => {
  const { activity } = props;

  return (
    <li>{activity.activityType} - {activity.name}</li>
  );
}

const DayItineraryComponent = (props) => {
  const { dayItinerary } = props;
  console.log("Day Itinerary", dayItinerary);

  const testAccom = new Accomodation(
                      'TEST ACCOMODATION - Tokyo Hotel',
                      'April 26, 2024',
                      'Tokyo Street, Tokyo, Japan',
                      'April 26th, 2024 - 10am',
                      'April 26th, 2024 - 3pm'
                    );

  return (
    <div className='bg-gray-200 rounded-lg shadow-lg pb-2 mb-10'>
      <div className='h-20 bg-glade-green-700 flex items-center justify-center rounded-t-lg my-3'>
        <h2 class="text-white text-2xl font-bold">{formatDateToHumanReadable(dayItinerary.date)}{dayItinerary.accomodation && " - " + dayItinerary.accomodation.city}</h2>
      </div>
      
      <div className="flex flex-row">
        <div className="basis-3/4 rounded px-3 bg-neutral-100 ml-2">
          <h2 className='text-xl font-semibold back mb-3'>📚 Itinerary</h2>
          {dayItinerary.activities.length == 0 && <p>No activities planned!</p>}
          {dayItinerary.activities.map(a => {
            return (
              <div class="bg-white rounded-lg shadow-lg flex mb-2">              
                <div class="w-1/4  bg-glade-green-800 flex items-center justify-center">
                  <p className='text-xl text-white text-center'>{a.activityType}</p>
                </div>
                
                <div class="w-3/4 p-4">
                  <h2 class="text-l font-bold mb-2">{a.name}</h2>
                  <p class="text-gray-700"></p>
                </div>
              </div>
            )
          
          
          })}
        </div>
        <AccomodationComponent accomodation={dayItinerary.accomodation} />
      </div>
    </div>
  );
}


const MainSection = (props) => {
  const itineraryReal = props.itinerary;

  console.log("Itinerary", itineraryReal);

  return (
    <div className="container mx-auto py-8 px-4 flex h-screen">
      <div className="w-1/4">
        {/* Left column - menu options */}
        <div className="bg-white shadow-md p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Date Selector</h2>
          <CalendarPicker />
        </div>
      </div>
      <div className="w-3/4 ml-4 overflow-y-auto">
        {/* Right column - informational component */}
        <div className="bg-white shadow-md p-4 rounded">
          {Object.entries(itineraryReal.dayItineraries).map(([key, val]) => <DayItineraryComponent dayItinerary={val}/>)}
        </div>
      </div>
    </div>
  );
}

function App() {

  // State to store the fetched data
  const [data, setData] = useState(null);
  // State to track loading state
  const [loading, setLoading] = useState(true);
  // State to track error state
  const [error, setError] = useState(null);

  const csvUrlForItinerary = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=1411334035&single=true&output=csv';
  const csvUrlForAccomodation = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpIX5s37vCVwqZhGynq7fjc-VIUKCYCGlgjdOa03sTXFB3Jdq6B6gcyzA5mWTrAvx6gaerK8Umws_Y/pub?gid=727628574&single=true&output=csv';  

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

  return (
    <div className="App bg-gray-100 min-h-screen">
      <Navbar />
      {loading && <p>Loading itinerary!</p>}
      {data && (<MainSection itinerary={data} />)}
    </div>
  )
};

export default App;
