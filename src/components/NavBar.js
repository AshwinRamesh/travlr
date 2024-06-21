import React, {forwardRef, useState} from "react";
import {formatDateForId} from "../helpers/dateHelpers";
import DatePicker from "react-datepicker";

const CalendarPicker = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const selectedDate = props.selectedDate;
  const setSelectedDate = props.setSelectedDate; // TODO - does this break the rendering?

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Scroll to the element with the same ID as the selected date
    const idName = formatDateForId(date);
    const element = document.getElementById(idName);
    if (element) {
      element.scrollIntoView();
      window.scrollBy(0,-90); //  TODO - fix: Required as the navbar currently hides the top 90~ px

    } else {
      console.log("Cannot find element" + idName);
    }
  };
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" inputMode='none' onClick={onClick} ref={ref}>
      📆
    </button>));
  return (
    <div>
      <DatePicker
        className='rounded border-solid border-2 px-2 border-slate-600'
        selected={selectedDate}
        onChange={handleDateChange}
        onKeyDown={(e) => e.preventDefault()}
        customInput={<ExampleCustomInput />}
        popperPlacement={'left-end'}
      />
    </div>
  );
};

export const NavBar = (props) => {
  return (
    <nav className="bg-glade-green-500 py-4 px-8 flex items-center justify-between fixed w-full top-0 z-10 mb-20">
      <div className="text-white font-bold text-lg">Travlr 🛫</div>
      <p className={"text-white"}>Trips</p>
      <p className={"text-white"}>Account</p>
      <CalendarPicker selectedDate={props.selectedDate} setSelectedDate={props.setSelectedDate}/>
    </nav>
  );
}