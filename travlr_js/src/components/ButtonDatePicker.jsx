import * as React from 'react';

import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function ButtonField(props) {
  const {
    setOpen,
    onOpenSideEffect,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="contained"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => {
        onOpenSideEffect();
        setOpen?.((prev) => !prev);
      }}
    >
      {label}
    </Button>
  );
}

function ButtonDatePicker(props) {
  const [open, setOpen] = React.useState(false);
  const onOpenSideEffect = props.onOpenSideEffect;

  //TODO -  I don't understand how the slots and props work with unpacking of props.
  return (
    <DatePicker
      slots={{ ...props.slots, field: ButtonField }}
      slotProps={{ ...props.slotProps, field: {setOpen, onOpenSideEffect} }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true);
      }}
      onOpenSideEffect={props.onOpenSideEffect}

    />
  );
}

export default function PickerWithButtonField({label, selectedDate, setSelectedDate, onOpenSideEffect}) {
  return (
    <ButtonDatePicker
      label={label}
      value={selectedDate}
      onChange={(newValue) => setSelectedDate(newValue)}
      onOpenSideEffect={onOpenSideEffect}
    />
  );
}
