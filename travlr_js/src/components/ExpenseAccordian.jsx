import {Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';


// TODO - need to fix UX (pb is too much)
// TODO - need a modal to show notes etc.
function ExpenseCard({id, name, type, cost, notes,}) {
  return (
    <Card sx={{minWidth: 275, mb: '5px'}} variant={'outlined'}>
      <CardContent>
        <Typography variant="subtitle1" component="div">
          <Typography fontWeight={'bold'} pb={1}>Name: {name}</Typography>
          <Typography fontWeight={'bold'} pb={1}>Type: {type}</Typography>
          <Typography fontWeight={'bold'} pb={1}>Cost: ${cost} AUD</Typography>
          <Typography pb={1}>Notes: {notes || "N/A"}</Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}


export function ExpenseAccordian({expenses, expenseTypes}) {

  const totalExpense = expenses ? expenses.total_expense : 0.0;
  const accommodation = expenses ? expenses.accommodation_expense : null;
  const otherExpenses = (expenses && expenses.other_expenses) ? expenses.other_expenses.expenses : [];

  return (<Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}
      aria-controls="panel1-content"
      id="panel1-header"
    >
      <AttachMoneyOutlinedIcon/>
      <Typography variant={'body1'} pl={1}>Expenses (${totalExpense})</Typography>
    </AccordionSummary>
    <AccordionDetails>

      {otherExpenses.map(e => {
        return <ExpenseCard key={e.id} id={'e.id'} name={e.name} cost={e.cost} type={expenseTypes[e.type] || "Unknown"} notes={e.notes}/>
      })}

    </AccordionDetails>
  </Accordion>);
}