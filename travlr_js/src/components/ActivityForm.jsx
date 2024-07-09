import {Box, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {DatePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import React, {useState} from "react";

function ActivityForm({expenseTypes, selectedDate}) {

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [activityType, setActivityType] = useState(''); // TODO - this needs to be different.
  const [date, setDate] = useState(selectedDate);
  const [notes, setNotes] = useState('');


  // TODO
  const handleSubmit = (e) => {
    return;
  }

  const onCancel = (e) => {
    return;
  }

  const activityTypeItems = Object.keys(expenseTypes).map(k => (
    <MenuItem key={k} value={k}>{expenseTypes[k]}</MenuItem>
  ))


  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} p={3}
         mx="auto">
      <Typography variant={"h6"}>Add Activity (TODO logic & submit) </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />

      <FormControl>
        <InputLabel id="activity-type-input-lbl">Type</InputLabel>
        <Select
          labelId="activity-type-input-lbl"
          value={activityType}
          label={"Type"}
          onChange={(e) => setActivityType(e.target.value)}
          required
          sx={{minWidth: 200, maxWidth: 200}}
        >
          {activityTypeItems}
        </Select>
      </FormControl>

      <TextField
        label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        required={false}
      />

      <DatePicker
        label="Date"
        value={date}
        sx={{maxWidth: 200}}
        onChange={(newDate) => setDate(newDate)}
        textField={(params) => <TextField {...params}
                                          required/>}
      />

      {/*TODO - need to map to API + move to textArea*/}
      <TextField
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        type={"text"}
        fullWidth
        label="Notes"/>


      <Box display={'flex'} justifyContent={'center'} gap={3}>
        <Button variant="contained" color="error" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </Box>

    </Box>
  );
}

export {ActivityForm}