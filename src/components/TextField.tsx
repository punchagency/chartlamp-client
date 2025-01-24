import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import React from 'react';

export const TextField: React.FC<OutlinedInputProps> = (props) => (
  <OutlinedInput
    sx={{
      borderRadius: '16px', // Adjust this value for more or less rounding
    }}
    {...props}
  />
);

export default TextField;
