import React from "react";
import {generateMapUrl} from "../helpers/other";

export const AccommodationComponent = (props) => {
  const {accommodation} = props;
  if (accommodation) {
    return (
      <div className="rounded bg-glade-green-100 mx-2 px-2 w-full">
        <h2 className='text-lg font-semibold'>🏚️ Accommodation <a href='#' className='text-sm text-blue-700'>(Edit)</a>
        </h2>
        <p className="text-left font-semibold">Name: {accommodation.name}</p>
        <p className='text-left font-semibold'>Address:
          <a className="text-blue-800 font-normal" href={generateMapUrl(accommodation.address)}
             id="mapLink"> {accommodation.address}</a>
        </p>
        <p className='text-left'>
          <span className={'font-semibold'}>Check-in Date: </span>{accommodation.checkin_date}
        </p>
        <p className='text-left'>
          <span className={'font-semibold'}>Check-out Date: </span>{accommodation.checkout_date}
        </p>
        <p className='text-left'>
          <span className={'font-semibold'}>Cost: </span>${accommodation.cost} ({accommodation.currency})
        </p>
      </div>
    );
  }
  return (
    <div className="rounded bg-glade-green-200 mx-2 px-2 w-full">
      <h2 className='text-lg font-semibold'>🏚️ Accommodation <a href='#' className='text-sm text-blue-700'>(Add)</a>
      </h2>
      <p>No accommodation booked!</p>
    </div>
  );

}
