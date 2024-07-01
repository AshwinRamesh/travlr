
function formatDate(date, asIso= false) {
    // Get month, day, and year from the Date object
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    // Return "YYYY-MM-DD"
    if (asIso) {
      return `${year}-${month}-${day}`;
    }
    // Return "MM-DD-YYYY"
    return `${month}-${day}-${year}`;
}

function enumerateDates(startDateStr, endDateStr, includeEndDate = false) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const dates = [];
    
    // Iterate through dates starting from startDate to endDate
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      // Push the formatted date string to the dates array
      const d = new Date(date);
      dates.push(formatDate(d));
    }
    
    if (includeEndDate) {
        return dates;
    } else {
        return dates.slice(0, -1);
    }
}

// Convert MM-DD-YYYY string into a Date obj
function formatStringToDate(strDate) {
    const [month, day, year] = strDate.split("-");
    return new Date(year, month - 1, day);
}

// date is a Date() obj
// Returns date-YYYY-MM-DD in the current TZ of the browser
function formatDateForId(date) {
  const year = String(date.getFullYear());
  const month = date.getMonth() + 1 < 10 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1);
  const day = date.getDate() < 10 ? "0" + String(date.getDate()) : String(date.getDate());
  const formattedDate = "date-" + year + "-" + month + "-" + day;
  return formattedDate;
}

function formatDateToHumanReadable(date) {
  // Define arrays for days of the week and months
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  // Get the day of the week, day of the month, month, and year
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Function to get the ordinal suffix for the day
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // catch all 11th, 12th, 13th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Construct the day with the ordinal suffix
  const dayWithSuffix = day + getOrdinalSuffix(day);

  // Construct the final formatted string
  return `${dayOfWeek} - ${dayWithSuffix} ${month}, ${year}`;
}

// Example usage
const date = new Date(2024, 6, 4); // Note: Months are 0-indexed (0 = January, 6 = July)
console.log(formatDate(date)); // Output: "Thursday - 4th of July, 2024"


export {formatDateToHumanReadable, formatDate, enumerateDates, formatDateForId, formatStringToDate};