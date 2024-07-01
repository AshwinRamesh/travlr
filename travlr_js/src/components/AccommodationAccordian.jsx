import {Accordion, AccordionDetails, AccordionSummary, Link, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore.js";
import {BedroomChildOutlined} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {generateMapUrl} from "../helpers/other.js";

// TODO - how do we want to handle checkouts
export function AccommodationAccordian({accommodation}) {

  if (accommodation) {
    return (<Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1-content"
        id="accommodation-accordian"
      >
        <BedroomChildOutlined/>
        <Typography variant={'body1'} pl={1}>Accommodation - {accommodation.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant={'subtitle1'} >Address: <Link href={generateMapUrl(accommodation.address)}>{accommodation.address}</Link></Typography>
        <Typography variant={'subtitle1'} >Check-in date: {accommodation.checkin_date}</Typography>
        <Typography variant={'subtitle1'} >Check-out date: {accommodation.checkout_date}</Typography>
        <Typography variant={'subtitle1'} >Cost: ${accommodation.cost} ({accommodation.currency})</Typography>
      </AccordionDetails>
    </Accordion>);
  }

  // TODO - need to wire in the add button
  // TODO - future: ability to call AI to get recommendations based on country and city?
  return (<Accordion defaultExpanded sx={{backgroundColor: 'lightyellow'}}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}
      aria-controls="panel1-content"
      id="accommodation-accordian"
    >
      <BedroomChildOutlined/>
      <Typography variant={'body1'} pl={1}>Accommodation - Need to book!</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Button variant={'contained'}>
        Add Accommodation
      </Button>
    </AccordionDetails>
  </Accordion>);


}