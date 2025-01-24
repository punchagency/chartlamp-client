/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';

interface StepDotsProps {
  activeStep: number;
}

const StepDots: React.FC<StepDotsProps> = ({ activeStep }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: activeStep === 1 ? 'primary.main' : 'grey.400',
          mx: 0.5,
        }}
      />
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: activeStep === 2 ? 'primary.main' : 'grey.400',
          mx: 0.5,
        }}
      />
    </Box>
  );
};

export default StepDots;