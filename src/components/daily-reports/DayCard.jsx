import React from 'react';
import { Box, Typography } from '@mui/material';

export default function DayCard({ day, selected, onClick, unified = false, isFirst = false }) {
  const isWarning = day.status === 'warning' || day.status === 'error';

  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        px: 1.5,
        py: 1.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0.25,
        cursor: 'pointer',
        borderRadius: (unified && isFirst) ? '0 16px 16px 0' : '16px',
        border: unified ? 'none' : (selected ? 'none' : '1.5px solid rgba(0,0,0,0.09)'),
        bgcolor: selected ? 'rgba(0,0,0,0.06)' : 'transparent',
        transition: 'all 0.15s',
        '&:hover': { bgcolor: selected ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)' },
      }}
    >
      <Typography sx={{ fontSize: 11, color: selected ? '#555' : 'text.secondary', fontWeight: 500, textTransform: 'uppercase' }}>
        {day.label}
      </Typography>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1A1A2E', lineHeight: 1.1 }}>
        {day.dayNumber}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: isWarning ? 'warning.main' : 'success.main',
            flexShrink: 0,
          }}
        />
        <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {isWarning ? 'Has issues' : 'No issues'}
        </Typography>
      </Box>
    </Box>
  );
}
