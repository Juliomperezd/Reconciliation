import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { AutoFixHigh } from '@mui/icons-material';

export default function DiscrepancyAlert({ onSolveAI, hasIssues = false }) {
  return (
    <Box sx={{ position: 'relative' }}>
      {/* Blur glow — only when hasIssues */}
      {hasIssues && (
        <Box sx={{
          position: 'absolute',
          inset: -2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fb923c 0%, #fcd34d 40%, #f87171 80%, #fdba74 100%)',
          filter: 'blur(6px)',
          opacity: 0.25,
          zIndex: 0,
        }} />
      )}

      {/* Card */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.07)',
          ...(hasIssues ? {
            background: [
              'radial-gradient(ellipse at 10% 60%, rgba(251,146,60,0.09) 0%, transparent 55%)',
              'radial-gradient(ellipse at 90% 10%, rgba(248,113,113,0.07) 0%, transparent 45%)',
              'radial-gradient(ellipse at 65% 90%, rgba(253,186,116,0.08) 0%, transparent 50%)',
              '#FFF7ED',
            ].join(', '),
          } : {
            bgcolor: '#F8F8F8',
          }),
          px: 2.5,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <AutoFixHigh sx={{ color: hasIssues ? '#C2410C' : '#666', fontSize: 20, flexShrink: 0, mt: 0.25 }} />
          <Box>
            <Typography sx={{ color: hasIssues ? '#9A3412' : '#333', fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
              Issues detected
            </Typography>
            <Typography sx={{ color: hasIssues ? '#C2410C' : '#777', fontSize: 13, mt: 0.25 }}>
              We found some issues between POS and declared amounts.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ pl: '32px' }}>
          <Button
            size="small"
            variant="contained"
            onClick={onSolveAI}
            sx={{
              whiteSpace: 'nowrap',
              bgcolor: hasIssues ? '#9A3412' : '#1A1A2E',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': { bgcolor: hasIssues ? '#7C2D12' : '#2d2d4e', boxShadow: 'none' },
            }}
          >
            Analyze with sundayAI
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
