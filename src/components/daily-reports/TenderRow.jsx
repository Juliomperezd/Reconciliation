import React, { useState } from 'react';
import { TableRow, TableCell, Typography, TextField, Box, Snackbar } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DeltaCell from './DeltaCell';
import { useCurrentPath } from '../../contexts/PathContext';

const SUNDAY_IDS = ['sunday-qr', 'sunday-pdq'];

export default function TenderRow({ tender, onUpdate, onEditTender }) {
  const navigate = useNavigate();
  const { currentPath } = useCurrentPath();
  const isSunday = SUNDAY_IDS.includes(tender.id);

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(tender.totalDeclared.toFixed(2));
  const [hovered, setHovered] = useState(false);
  const [done, setDone] = useState(false);

  const hasDiscrepancy = tender.totalInToast !== tender.totalDeclared;
  const delta = tender.totalInToast - tender.totalDeclared;

  const handleSave = () => {
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed)) onUpdate(tender.id, parsed);
    setEditing(false);
  };

  const applyPOS = () => {
    onUpdate(tender.id, tender.totalInToast);
    setEditValue(tender.totalInToast.toFixed(2));
    setEditing(false);
    setDone(true);
  };

  const showPill = hasDiscrepancy && (editing ? parseFloat(editValue) !== tender.totalInToast : hovered);

  // ── Sunday row — entire row is a link ────────────────────────────────────
  if (isSunday) {
    return (
      <TableRow
        onClick={() => navigate(`/${currentPath}/tender/${tender.id}`)}
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.025)' },
          '& td': { borderBottom: '1px solid rgba(0,0,0,0.06)', py: 1.5 },
        }}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 0.25 }}>
            <Typography sx={{ fontSize: 20 }}>{tender.icon}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{tender.name}</Typography>
          </Box>
        </TableCell>

        <TableCell align="right">
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            ${tender.totalInToast.toFixed(2)}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <Typography sx={{ fontSize: 14, fontWeight: 500, pr: 1 }}>
            ${tender.totalDeclared.toFixed(2)}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <DeltaCell delta={delta} />
        </TableCell>
      </TableRow>
    );
  }

  // ── Regular row — inline editable ────────────────────────────────────────
  return (
    <>
      <TableRow sx={{ '& td': { borderBottom: '1px solid rgba(0,0,0,0.06)', py: 1.5 } }}>
        <TableCell>
          <Box
            onClick={() => onEditTender?.(tender)}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1.5,
              cursor: 'pointer', borderRadius: 1, px: 1, py: 0.25,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
            }}
          >
            <Typography sx={{ fontSize: 20 }}>{tender.icon}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{tender.name}</Typography>
          </Box>
        </TableCell>

        <TableCell align="right">
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            ${tender.totalInToast.toFixed(2)}
          </Typography>
        </TableCell>

        {/* Total Declared — pill is absolutely positioned, never shifts layout */}
        <TableCell
          align="right"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            {/* Pill floats to the left, outside the flow */}
            {hasDiscrepancy && (
              <Box
                onMouseDown={(e) => e.preventDefault()}
                onClick={applyPOS}
                sx={{
                  position: 'absolute',
                  right: 'calc(100% + 8px)',
                  whiteSpace: 'nowrap',
                  px: 0.75, py: 0.4,
                  bgcolor: '#fff',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '4px',
                  fontSize: 12, fontWeight: 600,
                  color: 'text.secondary',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'opacity 0.15s',
                  opacity: showPill ? 1 : 0,
                  pointerEvents: showPill ? 'auto' : 'none',
                  '&:hover': { bgcolor: '#F5F5F5', color: 'text.primary' },
                }}
              >
                ${tender.totalInToast.toFixed(2)}
              </Box>
            )}

            {editing ? (
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
                autoFocus
                size="small"
                inputProps={{ style: { textAlign: 'right', fontSize: 14, padding: '4px 8px' } }}
                sx={{ width: 100 }}
              />
            ) : (
              <Typography
                onClick={() => setEditing(true)}
                sx={{
                  fontSize: 14, fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-block',
                  px: 1, py: 0.5,
                  borderRadius: 1,
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.05)', color: 'text.primary' },
                }}
              >
                ${tender.totalDeclared.toFixed(2)}
              </Typography>
            )}
          </Box>
        </TableCell>

        <TableCell align="center">
          <DeltaCell delta={delta} />
        </TableCell>
      </TableRow>

      <Snackbar
        open={done}
        autoHideDuration={2000}
        onClose={() => setDone(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: 'rgba(26,26,46,0.8)', color: '#fff',
            px: 2, py: 1.25, borderRadius: 2,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            fontSize: 14, fontWeight: 600,
          }}
        >
          <CheckCircle sx={{ fontSize: 18, color: '#fff' }} />
          Done
        </Box>
      </Snackbar>
    </>
  );
}
