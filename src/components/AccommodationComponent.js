import React from "react";
import {generateMapUrl} from "../helpers/other";

export const AccommodationComponent = (props) => {
  const {accomodation} = props;
  if (accomodation) {
    return (
      <div className="rounded bg-glade-green-100 mx-2 px-2 w-full">
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
    <div className="rounded bg-glade-green-200 mx-2 px-2 w-full">
      <h2 className='text-lg font-semibold'>🏚️ Accommodation <a href='#' className='text-sm text-blue-700'>(Add)</a>
      </h2>
      <p>No accommodation booked!</p>
    </div>
  );

}
