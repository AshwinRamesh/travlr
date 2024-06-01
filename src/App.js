import './App.css';
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { Activity, Accomodation, TripItinerary } from "./Activity.js";
import { downloadAndParseCSV } from './helpers/downloadGSheet.js';
import { formatDateForId, formatDateToHumanReadable, formatStringToDate } from './helpers/dateHelpers.js';
import "react-datepicker/dist/react-datepicker.css";


function generateMapUrl(query) {
  const prefix = "https://www.google.com/maps/search/?api=1&query=";
  return prefix + encodeURIComponent(query);
}

const CalendarPicker = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const selectedDate = props.selectedDate;
  const setSelectedDate = props.setSelectedDate;

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Scroll to the element with the same ID as the selected date
    const idName = formatDateForId(date);
    const element = document.getElementById(idName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log("Cannot find element" + idName);
    }
    console.log(date);
  };

  return (
    <div>
      <DatePicker
        showIcon
        className='rounded border-solid border-2 px-2 border-slate-600'
        selected={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
};


const Navbar = (props) => {
  return (
    <nav className="bg-glade-green-500 py-4 px-8 flex items-center justify-between fixed w-full top-0 z-10">
      <div className="text-white font-bold text-lg">Travlr 🛫</div>
      <ul className="flex space-x-4">
        <li><CalendarPicker selectedDate={props.selectedDate} setSelectedDate={props.setSelectedDate}/></li>
      </ul>
    </nav>
  );
}

const AccomodationComponent = (props) => {
  const { accomodation } = props;
  if (accomodation) {
    return (
      <div class="rounded bg-glade-green-100 mx-2 px-2 w-full">
        <h2 className='text-lg font-semibold'>🏚️ Accomodation</h2>
        <p className="text-left font-semibold">Name - {accomodation.name}</p>
        <p className='text-left font-semibold'>Address - 
          <a className="text-blue-800 font-normal" href={generateMapUrl(accomodation.address)} id="mapLink"> {accomodation.address}</a>
        </p>
      </div>
    );
  }
  return (
    <div class="rounded bg-glade-green-200 mx-2 px-2 w-full">
      <h2 className='text-lg font-semibold'>🏚️ Accomodation</h2>
      <p>No accomodation booked!</p>
    </div>
  );
  
}

const ActivityComponent = (props) => {
  const [activity, setActivity] = useState(props.activity);
  const [isCollapsed, setIsCollapsed] = useState(false);
  

  const toggleCollapse = () => {
    console.log("Trigger collapse", isCollapsed);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex mb-2">              
      <div className={`w-1/4 flex items-center justify-center ${activity.mapType().color}`}>
        <p className='text-md text-white text-center'>{activity.mapType().emoji}</p>
      </div>
      
      <div class="w-3/4 p-4">
        
        <div onClick={toggleCollapse}>
          <span className="text-l font-bold mb-2">{activity.name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414zM10 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className={`overflow-hidden transition-max-height duration-300 ${isCollapsed ? 'max-h-screen' : 'max-h-0'}`}>
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
  const { dayItinerary } = props;
  const date = formatStringToDate(dayItinerary.date)
  const idName = formatDateForId(date);

  return (
    <div id={idName} className='bg-gray-200 rounded-lg shadow-lg pb-2 mb-10'>
      <div className='h-20 bg-glade-green-700 flex items-center justify-center rounded-t-lg my-3'>
        <h2 class="text-white text-xl font-bold">{formatDateToHumanReadable(dayItinerary.date)}{dayItinerary.accomodation && " - " + dayItinerary.accomodation.city}</h2>
      </div>
      
      <div className="flex flex-row flex-wrap w-full">
        <div className="rounded px-3 bg-neutral-100 m-2 w-full">
          <h2 className='text-lg font-semibold mb-3'>📚 Itinerary</h2>
          {dayItinerary.activities.length == 0 && <p>No activities planned!</p>}
          {dayItinerary.activities.map(a => { return <ActivityComponent activity={a}/> })}
        </div>
        <AccomodationComponent accomodation={dayItinerary.accomodation} />
      </div>
    </div>
  );
}


const MainSection = (props) => {
  const itineraryReal = props.itinerary;
  const selectedDate = props.selectedDate;
  const setSelectedDate = props.setSelectedDate;

  return (
    <div className="mx-auto py-20 px-4 h-screen">
      <p>Date: {String(selectedDate)}</p>
      <div className="overflow-y-auto">
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

  return (
    <div className="App container bg-gray-100 min-h-screen max-w-lg">
      <Navbar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {loading && <p>Loading itinerary!</p>}
      {data && (<MainSection itinerary={data} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />)}
    </div>
  )
};

export default App;
