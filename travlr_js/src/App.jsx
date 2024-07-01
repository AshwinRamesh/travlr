import Button from '@mui/material/Button';
import {
  Box,
  Container,
  Paper,
  Typography
} from "@mui/material";
import {NavBar} from "./components/NavBar.jsx";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Divider from '@mui/material/Divider';
import {AccommodationAccordian} from "./components/AccommodationAccordian.jsx";
import {ActivityAccordian} from "./components/ActivityAccordian.jsx";
import {ExpenseAccordian} from "./components/ExpenseAccordian.jsx";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import HikingIcon from "@mui/icons-material/Hiking";
import {BedroomChildOutlined} from "@mui/icons-material";
import {useEffect, useState} from "react";
import ExpenseForm from "./components/ExpenseForm.jsx";
import {travlrApiClient} from "./clients/TravlrApiClient.js";
import {formatDate, formatDateToHumanReadable} from "./helpers/dateHelpers.js";
import dayjs from "dayjs";

function App() {

  const SCREEN_ITINERARY = 'itinerary';
  const SCREEN_ADD_EXPENSE = 'expense';
  const SCREEN_ADD_ACTIVITY = 'activity';
  const SCREEN_ADD_ACCOMMODATION = 'accommodation';
  const tripId = 1; // TODO - make this dynamic

  // TODO -  Refresh seed... bit hacky!
  const [seed, setSeed] = useState(1);
  const [screen, setScreen] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trip, setTrip] = useState(null);
  const [dayItinerary, setDayItinerary] = useState(null);

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

  const refreshPageAndGoBackToItineraryView = () => {
    setSeed(Math.random());

  }


  useEffect(() => {
    setScreen(SCREEN_ITINERARY);

    const tripDataPromise = travlrApiClient.getTrip(tripId);
    const dayItineraryPromise = travlrApiClient.getTripItineraryForDate(tripId, formatDate(selectedDate, true));


    // TODO - Does making multiple setFoo impact React re-render.
    Promise.all([tripDataPromise, dayItineraryPromise])
      .then(([tripData, dayItineraryData]) => {
        setTrip(tripData);
        setDayItinerary(dayItineraryData);
        console.log(selectedDate, tripData, dayItineraryData); // TODO - remove later
      });


  }, [selectedDate, seed, ]);

  return (trip &&
    <>
      <Container maxWidth={"md"} sx={{height: 5000}}>
        <NavBar/>
        <Box maxWidth={'lg'}>
          <Typography variant={'h4'} textAlign={'center'} py={2}>{trip.name}</Typography>
          <Paper elevation={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={5} py={2}>
              <Button><ArrowBackIosIcon onClick={decrementDate}/></Button>
              <Box textAlign="center">
                <Typography variant="h6" sx={{fontWeight: 'bold'}}>{formatDateToHumanReadable(selectedDate)}</Typography>
                {/*TODO - need to only do this if the values are available.*/}
                {dayItinerary.accommodation &&
                  <Typography variant="h6" sx={{fontWeight: 'bold'}}>{dayItinerary.accommodation.city}, {dayItinerary.accommodation.country}</Typography>
                }
              </Box>
              <Button onClick={incrementDate}><ArrowForwardIosIcon/></Button>
            </Box>
            <Box display={'flex'} justifyContent={'center'} gap={'5px'} mb={2}>
              <Button
                variant="contained"><AttachMoneyOutlinedIcon
                onClick={(e) => setScreen(SCREEN_ADD_EXPENSE)}
              /></Button>
              <Button variant="contained"><HikingIcon/></Button>
              <Button variant="contained"><BedroomChildOutlined/></Button>
              <Button
                variant="contained"
                onClick={(e) => setScreen(SCREEN_ITINERARY)}
              >
                <CalendarMonthIcon/>
              </Button>
            </Box>
            <Divider/>
            {/*Show Itinerary View*/}
            {screen === SCREEN_ITINERARY && (
              <Box p={2}>
                <AccommodationAccordian accommodation={dayItinerary.accommodation}/>
                <ActivityAccordian activities={dayItinerary.activities}/>
                <ExpenseAccordian expenses={dayItinerary.expenses}/>
              </Box>
            )}

            {screen === SCREEN_ADD_EXPENSE && (
              <ExpenseForm tripId={trip.id} selectedDate={dayjs(selectedDate)} refreshFn={refreshPageAndGoBackToItineraryView} onCancelFn={() => {setScreen(SCREEN_ITINERARY);}}/>
            )}


          </Paper>

        </Box>

      </Container>
    </>
  )
}

export default App
