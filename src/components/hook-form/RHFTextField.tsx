import { OutlinedInputProps, Stack, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '../TextField';

// ----------------------------------------------------------------------

type Props = OutlinedInputProps & {
  name: string;
  capitalize?: boolean;
  uppercase?: boolean;
};

export default function RHFTextField({ name, capitalize = false, uppercase = false, ...other }: Props) {
  const { control } = useFormContext();

  const capitalizeFirstLetter = (value: string) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const capitalizeLetters = (value: string) => {
    if (!value) return value;
    return value.toUpperCase();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing={0}>
        <TextField
          {...field}
          fullWidth
          value={
            typeof field.value === 'number' && field.value === 0
              ? ''
              : capitalize
              ? capitalizeFirstLetter(field.value)
              : uppercase
              ? capitalizeLetters(field.value)
              : field.value
          }
          error={!!error}
          {...other}
        />
        {error && (
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            {error?.message}
          </Typography>
        )}
        </Stack>
      )}
    />
  );
}