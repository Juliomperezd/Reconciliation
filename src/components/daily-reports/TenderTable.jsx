import React from 'react';
import {
  TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Typography, Box, Paper,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import TenderRow from './TenderRow';

export default function TenderTable({ tenders, onUpdateTender, onAddTender, onEditTender }) {
  return (
    <Box>
      <TableContainer component={Paper} elevation={0} sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow sx={{ '& th': { bgcolor: '#fff', fontWeight: 400, fontSize: 12, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, py: 1, borderBottom: 'none' } }}>
              <TableCell>Tender</TableCell>
              <TableCell align="right">Total in POS</TableCell>
              <TableCell align="right">Total Declared</TableCell>
              <TableCell align="center">Delta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenders.map((tender) => (
              <TenderRow key={tender.id} tender={tender} onUpdate={onUpdateTender} onEditTender={onEditTender} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Tender */}
      <Box
        onClick={onAddTender}
        sx={{
          mt: 1.5,
          ml: 2,
          px: 1.5,
          py: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          cursor: 'pointer',
          color: 'text.secondary',
          borderRadius: 1.5,
          transition: 'all 0.15s',
          '&:hover': { color: 'text.primary', bgcolor: 'rgba(0,0,0,0.05)' },
        }}
      >
        <Add fontSize="small" />
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Add tender line</Typography>
      </Box>
    </Box>
  );
}
