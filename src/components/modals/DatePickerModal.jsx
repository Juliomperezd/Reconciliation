import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, List, ListItemButton,
  ListItemText, ListItemIcon, Box, Select, MenuItem,
  FormControl, InputLabel, Typography, Chip, IconButton,
} from '@mui/material';
import { Close, CheckCircle, Warning } from '@mui/icons-material';

export default function DatePickerModal({ open, onClose, days, selectedDayId, onSelectDay }) {
  const [filter, setFilter] = useState('Last month');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Select a date</Typography>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Period</InputLabel>
          <Select value={filter} label="Period" onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="Last week">Last week</MenuItem>
            <MenuItem value="Last month">Last month</MenuItem>
            <MenuItem value="Last 3 months">Last 3 months</MenuItem>
            <MenuItem value="Custom">Custom range</MenuItem>
          </Select>
        </FormControl>

        <List disablePadding>
          {days.map((day) => {
            const isSelected = day.id === selectedDayId;
            const isWarning = day.status === 'warning';
            return (
              <ListItemButton
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': { bgcolor: 'rgba(233,30,140,0.08)' },
                  '&.Mui-selected:hover': { bgcolor: 'rgba(233,30,140,0.12)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {isWarning
                    ? <Warning sx={{ color: 'warning.main', fontSize: 18 }} />
                    : <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: isSelected ? 700 : 400, fontSize: 14 }}>
                        {day.label} {day.dayNumber} — March 2026
                      </Typography>
                      {day.isToday && <Chip label="Today" size="small" color="primary" sx={{ height: 18, fontSize: 10 }} />}
                    </Box>
                  }
                  secondary={
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                      POS: ${day.totalPOS.toFixed(2)} · Declared: ${day.totalDeclared.toFixed(2)}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
