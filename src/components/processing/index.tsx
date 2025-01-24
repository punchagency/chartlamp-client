import { Box, Typography } from '@mui/material';
import ClockFace from '../ClockFace';

const ProcessingScreen = ({ description }: { description: string }) => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          border: '8px solid #f3f3f3',
          borderTop: '8px solid #2E3133',
          borderRadius: '50%',
          animation: 'spin 2s linear infinite',
        }}
      />
      <ClockFace />
      <Typography>
        {description ?? ''}
      </Typography>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default ProcessingScreen;