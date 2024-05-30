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

function formatDate(date) {
    // Get month, day, and year from the Date object
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
  
    // Concatenate the parts into the desired format "MM-DD-YYYY"
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

export {formatDateToHumanReadable, formatDate, enumerateDates};