import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
export function ExpenseAccordian({expenses}) {

  const totalExpense = expenses ? expenses.total_expense: 0.0;
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
      <ul>
        <li>Accommodation: ${accommodation ? accommodation.expense_per_night: "0"}</li>
        {otherExpenses.map(e => {
          return <li key={e.id}>{e.name} - ${e.cost}</li>
        })}
      </ul>

    </AccordionDetails>
  </Accordion>);
}