import {formatDate} from "../helpers/dateHelpers";
import {DayItineraryComponent} from "./DayItineraryComponent";
import React from "react";

export const MainSection = (props) => {
  const dayItinerary = props.dayItinerary;
  const selectedDate = formatDate(props.selectedDate);
  const setSelectedDate = props.setSelectedDate;

  return (
        <DayItineraryComponent itinerary={dayItinerary} setSelectedDate={setSelectedDate} selectedDate={props.selectedDate}/>
  );
}