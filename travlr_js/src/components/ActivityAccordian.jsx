import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HikingIcon from '@mui/icons-material/Hiking';
import Button from "@mui/material/Button";
import ActivityCard from "./ActivityCard.jsx";

export function ActivityAccordian({activities,}) {

  return <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}
      aria-controls="panel1-content"
      id="panel1-header"
    >
      <HikingIcon/>
      <Typography variant={'body1'} pl={1}>Activities</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {activities && activities.length == 0 &&
        <Button variant={'contained'}>Add Activity</Button>
      }
      {activities && activities.length > 0 && (
        <div>
          {activities.map(a => {
            return <ActivityCard key={a.id} activity={a}/>
          })}
        </div>
      )
      }
    </AccordionDetails>
  </Accordion>;
}