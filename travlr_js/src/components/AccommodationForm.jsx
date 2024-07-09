import {Box, FormControl, InputLabel, Select, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import {DatePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import React, {useState} from "react";

function AccommodationForm() {

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [cost, setCost] = useState(0.0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [notes, setNotes] = useState('');

  // TODO
  const handleSubmit = (e) => {
    return;
  }

  const onCancel = (e) => {
    return;
  }


  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} p={3}
         mx="auto">
      <Typography variant={"h6"}>Add Accommodation (TODO logic & submit) </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />

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
        required
      />

      <DatePicker
        label="Check-in date"
        value={checkInDate}
        sx={{maxWidth: 200}}
        onChange={(newDate) => setCheckInDate(newDate)}
        textField={(params) => <TextField {...params}
                                          required/>}
      />

      <DatePicker
        label="Check-out date"
        value={checkOutDate}
        sx={{maxWidth: 200}}
        onChange={(newDate) => setCheckOutDate(newDate)}
        textField={(params) => <TextField {...params}
                                          required/>}
      />

      <TextField
        label="Total Cost ($AUD)"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        type="number"
        fullWidth
        required
        sx={{maxWidth: 200}}
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

export {AccommodationForm}