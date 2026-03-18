import React from 'react';
import { Paper, Box, Button, Badge, Typography } from '@mui/material';
import { HelpOutline, ChatBubbleOutline, CheckCircle } from '@mui/icons-material';

function BarAction({ icon, label, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        cursor: 'pointer',
        px: 2,
        py: 1,
        borderRadius: 1.5,
        '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
      }}
    >
      <Box sx={{ color: '#555', display: 'flex' }}>{icon}</Box>
      <Typography sx={{ fontSize: 11, color: '#555', fontWeight: 500, lineHeight: 1 }}>{label}</Typography>
    </Box>
  );
}

const PANEL_WIDTH = 400;

export default function FloatingActionBar({ commentCount = 0, onHelp, onComments, onValidate, validated = false, validateDisabled = false, panelOpen = false }) {
  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 24,
        left: panelOpen ? `calc(50% - ${PANEL_WIDTH / 2}px)` : '50%',
        transform: 'translateX(-50%)',
        transition: 'left 0.3s ease',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 2,
        py: 1.25,
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}
    >
      <BarAction icon={<HelpOutline fontSize="small" />} label="Help" onClick={onHelp} />

      <BarAction
        icon={
          <Badge badgeContent={commentCount} sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16, bgcolor: '#FF17E9', color: '#000' } }}>
            <ChatBubbleOutline fontSize="small" />
          </Badge>
        }
        label="Comments"
        onClick={onComments}
      />

      {/* Validate — vertical: icon + label */}
      <Button
        onClick={onValidate}
        disabled={validateDisabled || validated}
        sx={{
          ml: 0.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.25,
          bgcolor: validated ? '#4CAF50' : '#1A1A2E',
          color: '#fff',
          px: 2.5,
          py: 1,
          borderRadius: 1.5,
          minWidth: 0,
          lineHeight: 1,
          '&:hover': { bgcolor: validated ? '#388E3C' : '#2d2d4e' },
          '&.Mui-disabled': { bgcolor: '#ccc', color: '#999' },
        }}
      >
        <CheckCircle sx={{ fontSize: 18 }} />
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'inherit', lineHeight: 1, textTransform: 'none' }}>
          {validated ? 'Validated' : 'Validate'}
        </Typography>
      </Button>
    </Paper>
  );
}
