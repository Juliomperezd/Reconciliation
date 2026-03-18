import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import DayCard from './DayCard';

const MAX_VISIBLE_DAYS = 7;

export default function DateStrip({ days, selectedDayId, onSelectDay, onSeeAll, unified = false }) {
  const visibleDays = days.slice(-MAX_VISIBLE_DAYS);

  return (
    <Box sx={{ display: 'flex', gap: '8px' }}>
      {/* See All Card */}
      <Paper
        onClick={onSeeAll}
        elevation={0}
        sx={{
          flexShrink: 0,
          width: 72,
          px: 1.5,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          cursor: 'pointer',
          borderRadius: 2,
          border: unified ? 'none' : '1.5px solid rgba(0,0,0,0.09)',
          bgcolor: 'transparent',
          transition: 'all 0.15s',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
        }}
      >
        <CalendarMonth sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 600 }}>
          See all
        </Typography>
      </Paper>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(0,0,0,0.07)' }} />

      {visibleDays.map((day, i) => (
        <DayCard
          key={day.id}
          day={day}
          selected={selectedDayId === day.id}
          onClick={() => onSelectDay(day.id)}
          unified={unified}
          isFirst={i === 0}
        />
      ))}
    </Box>
  );
}
