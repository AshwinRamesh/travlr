import {formatDate} from "../helpers/dateHelpers";
import {DayItineraryComponent} from "./DayItineraryComponent";
import React from "react";

export const MainSection = (props) => {
  const itineraryReal = props.itinerary;
  const selectedDate = formatDate(props.selectedDate);
  const setSelectedDate = props.setSelectedDate;
  const val = itineraryReal.dayItineraries[selectedDate];

  console.log("MAIN SECTION", selectedDate, setSelectedDate);

  return (
    <div className="mx-auto px-4 h-screen">
      {/* Right column - informational component */}
      <div className="bg-white shadow-md p-4 rounded">
        <DayItineraryComponent dayItinerary={val} setSelectedDate={setSelectedDate} selectedDate={props.selectedDate}/>
      </div>
    </div>
  );
}