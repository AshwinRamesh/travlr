function formatDateToHumanReadable(dateString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const [month, day, year] = dateString.split('-');
    const monthName = months[parseInt(month, 10) - 1];
  
    let daySuffix;
    if (day === '1' || day === '21' || day === '31') {
      daySuffix = 'st';
    } else if (day === '2' || day === '22') {
      daySuffix = 'nd';
    } else if (day === '3' || day === '23') {
      daySuffix = 'rd';
    } else {
      daySuffix = 'th';
    }
  
    return `${monthName} ${parseInt(day, 10)}${daySuffix}, ${year}`;
}

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

export {formatDateToHumanReadable, formatDate, enumerateDates, formatDateForId, formatStringToDate};