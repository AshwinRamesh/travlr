import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import {travlrApiClient} from "../clients/TravlrApiClient.js";

function ExpenseForm({tripId, expenseTypes, selectedDate, refreshFn, onCancelFn,}) {
  const [cost, setCost] = useState('');
  const [activityName, setActivityName] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [activityType, setActivityType] = useState('');
  const [notes, setNotes] = useState('');

  // TODO - Needs better validation and exception handling probably. TODO - test bad input?
  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedDate = date.format("YYYY-MM-DD");
    travlrApiClient.createExpense(tripId, formattedDate, activityName, cost, activityType, notes)
      .then((r) => {
        refreshFn();
      });
  };

  const activityTypeItems = Object.keys(expenseTypes).map(k => (
    <MenuItem key={k} value={k}>{expenseTypes[k]}</MenuItem>
    ))

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} p={3}
         mx="auto">
      <Typography variant={"h6"}>Add Expense</Typography>
      <TextField
        label="Activity Name"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        fullWidth
        required
      />
      <Box display={'flex'} flexWrap={'wrap'} justifyContent={'start'} gap={3}>
        <FormControl>
          <InputLabel id="activity-type-input-lbl">Type</InputLabel>
          <Select
            labelId="activity-type-input-lbl"
            value={activityType}
            label={"Type"}
            onChange={(e) => setActivityType(e.target.value)}
            required
            sx={{minWidth: 200, maxWidth:200}}
          >
            {activityTypeItems}
          </Select>
        </FormControl>

        <TextField
          label="Cost ($AUD)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          type="number"
          fullWidth
          required
          sx={{maxWidth: 200}}
        />

      </Box>

      {/*TODO - need to map to API + move to textArea*/}
      <TextField
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        type={"text"}
        fullWidth
        label="Notes"/>

      <DatePicker
        label="Date"
        value={date}
        sx={{maxWidth: 200}}
        onChange={(newDate) => setDate(newDate)}
        textField={(params) => <TextField {...params}
                                          required/>}
      />
      <Box display={'flex'} justifyContent={'center'} gap={3}>
        <Button variant="contained" color="error" onClick={onCancelFn}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </Box>

    </Box>
  );
}

export default ExpenseForm;