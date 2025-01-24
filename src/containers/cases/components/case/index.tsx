import { SECONDARY, pxToRem } from '@/theme';
import { Box } from '@mui/material';
import React from 'react'

export default function CaseFirstView() {
  return (
    <Box
      sx={{
        display: "flex",
        direction: "row",
        border: `1px solid ${SECONDARY[50]}`,
        borderRadius: pxToRem(24),
        gap: pxToRem(24),
      }}
    >
      
    </Box>
  );
}
