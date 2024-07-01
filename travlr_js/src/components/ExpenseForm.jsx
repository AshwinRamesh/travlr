import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Typography} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import {travlrApiClient} from "../clients/TravlrApiClient.js";

function ExpenseForm({tripId, selectedDate, refreshFn, onCancelFn,}) {
  const [cost, setCost] = useState('');
  const [activityName, setActivityName] = useState('');
  const [date, setDate] = useState(selectedDate);

  // TODO - Needs better validation and exception handling probably. TODO - test bad input?
  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedDate = date.format("YYYY-MM-DD");
    travlrApiClient.createExpense(tripId, formattedDate, activityName, cost)
      .then((r) => {
        refreshFn();
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} p={3} width={300}
         mx="auto">
      <Typography variant={"h6"}>Add Expense</Typography>
      <TextField
        label="Activity Name"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Cost ($AUD)"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        type="number"
        fullWidth
        required
      />

      <DatePicker
        label="Date"
        value={date}
        onChange={(newDate) => setDate(newDate)}
        textField={(params) => <TextField {...params} fullWidth required />}
      />
      <Box display={'flex'} justifyContent={'space-evenly'}>
        <Button variant="contained" color="error" onClick={onCancelFn}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </Box>

    </Box>
  );
}

export default ExpenseForm;