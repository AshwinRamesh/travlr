import { formatDate,  enumerateDates} from "./helpers/dateHelpers";


export class Activity {
    constructor(name, date, activityType, address, details) {
        this.name = name;
        this.date = date; // TODO - have a method to make this human readable.
        this.activityType = activityType; // TODO - need to validate later.
        this.address = address;
        this.city = null;
        this.country = null;
        this.details = details;
        // TODO - other props
    }

    mapType() {
        switch (this.activityType) {
            case "Accomodation":
                return {
                    'emoji': "🏠",
                    'altText': "Accomodation",
                    'color': 'bg-activity-accommodation'
                };
            case "Food":
                return {
                    'emoji': "🍔 🍺",
                    'altText': 'Food',
                    'color': 'bg-activity-food'
                };
            case "Flight":
                return {
                    'emoji': "🛫",
                    'altText': 'Flight',
                    'color': 'bg-red-800'
                };
            case "Check-In":
                return {
                    'emoji': "➡️ 🏠",
                    'altText': 'Check-In',
                    'color': 'bg-activity-accommodation'

                };
            case "Check-Out":
                return {
                    'emoji': "🏠 ➡️",
                    'altText': 'Check-Out',
                    'color': 'bg-activity-accommodation'
                };

            case "Sightseeing":
                return {
                    'emoji': "📸",
                    'altText': 'Check-Out',
                    'color': 'bg-activity-sightseeing'
                };
            default:
                return {
                    'emoji': "⁉️",
                    'altText': this.activityType,
                    'color': 'bg-pink-800'
                }
                

        }
    }
}

// TODO - add check-in, check-out
export class Accomodation extends Activity {
    constructor(name, date, address, checkInDate, checkOutDate) {
        super(name, date, "Accomodation", address)
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
    }
}

export class DayItinerary {
    // TODO - itinerary for a single day

    constructor(date) {
        // Date for the itinerary - agnostic of TZ
        // TODO - need to handle TZ stuff~~
        this.date = date;
        
        // All Activities (excluding accomodation)
        this.activities = [];
        
        // Accomodation obj - Null means that there is no accom currently.
        this.accomodation = null;
    }
}

export class TripItinerary {
    // TODO - itinerary for whole trip

    constructor() {
        
        // All activities as a list
        this.activities = [];
        
        // All day activities {date --> DayItinerary}
        this.dayItineraries = {};
    }

    // TODO - do times later.
    addAccomodationFromGSheet(rawData) {
        const checkInDate = rawData["Check-in Date"];
        const checkOutDate = rawData["Check-out Date"];
        const city = rawData['City'];
        const country = rawData['Country'];
        const name = rawData['Name'];
        const address = rawData['Address'];

        if (!(checkInDate && checkOutDate)) {
            return; // Not valid accomidation.
        }

        // Add check-in & checkout
        const checkInActivity = new Activity("Check-in: " + name, checkInDate, "Check-In", address, null);
        const checkOutActivity = new Activity("Check-out: " + name, checkOutDate, "Check-Out", address, null);
        this.addactivity(checkInActivity);
        this.addactivity(checkOutActivity);

        const accomodationDates = enumerateDates(checkInDate, checkOutDate);
        accomodationDates.forEach(accomodationDate => {
            const accomodation = new Accomodation(name, accomodationDate, address, checkInDate, checkOutDate);
            accomodation.city = city;
            accomodation.country = country;
            accomodation.address = address;

            this.addactivity(accomodation);
        });


    }

    // Add activity - will not add anything related to accomodation.
    // This is parsed from the accom sheet.
    addActivityFromGSheet(rawData) {
        const activityDate = rawData["Date"];
        const activityDayOfWeek = rawData["Day of week"];
        const activityType = rawData["Type"]
        const activityCity = rawData["City"];
        const activityCountry = rawData["Country"];
        const activityName = rawData["Activity Name"];
        const activityDetail = rawData["Activity Details"];

        // Skip all activities that are accomodation related
        const accomTypeStrList = ["🏠 Accomodation", "Check In", "Check Out"];
        if (accomTypeStrList.includes(activityType)) {
            return; 
        }

        // Create DayItinerary for each unique date.
        if (activityDate) {
            if (!(activityDate in this.dayItineraries)) {
                this.dayItineraries[activityDate] = new DayItinerary(activityDate);
            }
        }

        // TODO - Skip all activities that do not have content
        if (!activityType || activityType == "" || !activityDate || activityDate == "") {
            return;
        }

        // Add activity
        const a = new Activity(activityName, activityDate, activityType, "", activityDetail);
        this.addactivity(a);
    }

    addactivity(activity) {
        if (!(activity.date in this.dayItineraries)) {
            this.dayItineraries[activity.date] = new DayItinerary(activity.date);
        }

        if (activity.activityType == "Accomodation") {
            this.dayItineraries[activity.date].accomodation = activity;
        } else {
            this.activities.push(activity);
            this.dayItineraries[activity.date].activities.push(activity);
        }
    }


    getDayItineraryByDate(dateVal) {
        if (dateVal in this.dayItineraries) {
            return this.dayItineraries[dateVal]
        }
        return null;
    }
}

