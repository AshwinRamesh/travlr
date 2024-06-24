import {formatDateForId, formatDateToHumanReadable, formatStringToDate} from "../helpers/dateHelpers";
import React from "react";
import {AccommodationComponent} from "./AccommodationComponent";
import {ActivityComponent} from "./ActivityComponent";

export const DayItineraryComponent = (props) => {
  const {dayItinerary} = props;
  const date = formatStringToDate(dayItinerary.date)
  const selectedDate = props.selectedDate;
  const setSelectedDate = props.setSelectedDate;
  const idName = formatDateForId(date);

  const incrementDate = () => {
    const newDate = selectedDate.getDate() + 1;
    selectedDate.setDate(newDate);
    const d = new Date(selectedDate);
    setSelectedDate(d);
  }

  const decrementDate = () => {
    const newDate = selectedDate.getDate() - 1;
    selectedDate.setDate(newDate);
    const d = new Date(selectedDate);
    setSelectedDate(d);
  }

  return (
    <div id={idName} className='bg-gray-200 rounded-lg shadow-lg pb-2 mb-10'>
      <div className='h-20 bg-glade-green-700 flex rounded-t-lg my-3 items-center'>
        <button className={'pl-5 text-lg'} onClick={decrementDate}>⬅️</button>
        <h2 className="text-white text-xl font-bold ml-auto mr-auto">{formatDateToHumanReadable(dayItinerary.date)}
          <pre className={'text-lg'}>
            {dayItinerary.accomodation && dayItinerary.accomodation.city}
            {!dayItinerary.accomodation && "Seoul, Korea"}
          </pre>
        </h2>
        <button className={'pr-5 text-lg'} onClick={incrementDate}>➡️</button>
      </div>

      <div className="flex flex-row flex-wrap w-full">
        <AccommodationComponent accomodation={dayItinerary.accomodation}/>
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