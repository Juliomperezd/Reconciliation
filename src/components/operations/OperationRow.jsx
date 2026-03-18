import React, { useState } from 'react';
import { TableRow, TableCell, Typography, Chip, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert, CreditCard } from '@mui/icons-material';

const STATUS_COLORS = {
  'Paid': { bg: 'rgba(76,175,80,0.1)', color: '#2E7D32', label: 'Paid' },
  'Partially paid': { bg: 'rgba(255,152,0,0.1)', color: '#E65100', label: 'Partial' },
  'Refunded': { bg: 'rgba(33,150,243,0.1)', color: '#1565C0', label: 'Refunded' },
  'Notified': { bg: 'rgba(76,175,80,0.1)', color: '#2E7D32', label: 'Notified' },
  'Not notified': { bg: 'rgba(255,152,0,0.1)', color: '#E65100', label: 'Not notified' },
};

export default function OperationRow({ operation }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const lines = operation.dateTime.split('\n');

  const sundayStyle = STATUS_COLORS[operation.sundayStatus] || {};
  const posStyle = STATUS_COLORS[operation.posStatus] || {};

  return (
    <TableRow
      sx={{
        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
        '& td': { borderBottom: '1px solid rgba(0,0,0,0.06)', py: 1.5 },
        bgcolor: operation.hasIssue ? 'rgba(255,152,0,0.03)' : 'transparent',
      }}
    >
      {/* Info */}
      <TableCell>
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{lines[0]}</Typography>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{lines[1]}</Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.3 }}>
          {operation.source} · <span style={{ color: '#666' }}>{operation.sourceType}</span>
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{operation.server}</Typography>
      </TableCell>

      {/* Payment */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 32, height: 22, bgcolor: operation.paymentMethod.color, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard sx={{ color: '#fff', fontSize: 14 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>•••• {operation.paymentMethod.last4}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>${operation.total.toFixed(2)}</Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Chip
            label={operation.sundayStatus}
            size="small"
            sx={{ bgcolor: sundayStyle.bg, color: sundayStyle.color, fontWeight: 600, fontSize: 11, height: 22 }}
          />
          <Chip
            label={operation.posStatus}
            size="small"
            sx={{ bgcolor: posStyle.bg, color: posStyle.color, fontWeight: 600, fontSize: 11, height: 22 }}
          />
        </Box>
      </TableCell>

      {/* Actions */}
      <TableCell align="center">
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreVert fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: 14 }}>View details</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: 14 }}>Mark as resolved</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: 14 }}>Add to reconciliation</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: 14, color: 'error.main' }}>Flag issue</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}
