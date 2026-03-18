import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

export default function DeltaCell({ delta }) {
  if (delta === 0) {
    return <CheckCircle sx={{ color: 'success.main', fontSize: 22 }} />;
  }
  return (
    <Chip
      label={`${delta > 0 ? '+' : ''}$${Math.abs(delta).toFixed(2)}`}
      size="small"
      sx={{
        bgcolor: 'rgba(251,146,60,0.13)',
        color: '#9A3412',
        border: 'none',
        fontWeight: 700,
        fontSize: 12,
      }}
    />
  );
}
