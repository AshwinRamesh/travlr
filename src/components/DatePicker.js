import React, {forwardRef, useState} from "react";
import {formatDateForId} from "../helpers/dateHelpers";
import DatePicker from "react-datepicker";


const CustomCalendarInput = forwardRef(function CustomCalendarInput(props, ref) {
  const onClick = props.onClick;
  return <span id={'custom-cal-input'} className="bg-glade-green-500 hover:bg-glade-green-800 text-white font-bold py-2 px-4 rounded" inputMode='none' onClick={onClick} ref={ref}>📆</span>;
});

export const CalendarPicker = forwardRef(function CalendarPicker(props, ref) {
  const selectedDate = props.selectedDate;
  const setSelectedDate = props.setSelectedDate; // TODO - does this break the rendering?

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Scroll to the element with the same ID as the selected date
    const idName = formatDateForId(date);
    const element = document.getElementById(idName);
    if (element) {
      element.scrollIntoView();
      window.scrollBy(0, -70); //  TODO - fix: Required as the navbar currently hides the top 90~ px

    } else {
      console.log("Cannot find element" + idName);
    }
  };

  return (
    <div>
      <DatePicker
        className='rounded border-solid border-2 px-2 border-slate-600'
        selected={selectedDate}
        onChange={handleDateChange}
        onKeyDown={(e) => e.preventDefault()}
        customInput={<CustomCalendarInput />}
        popperPlacement={'left-end'}
        ref={ref}
        shouldCloseOnSelect={true}
      />
    </div>
  );
});