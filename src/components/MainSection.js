import {formatDate} from "../helpers/dateHelpers";
import {DayItineraryComponent} from "./DayItineraryComponent";
import React from "react";

export const MainSection = (props) => {
  const itineraryReal = props.itinerary;
  const selectedDate = formatDate(props.selectedDate);
  const setSelectedDate = props.setSelectedDate;
  const val = itineraryReal.dayItineraries[selectedDate];

  return (
        <DayItineraryComponent dayItinerary={val} setSelectedDate={setSelectedDate} selectedDate={props.selectedDate}/>
  );
}