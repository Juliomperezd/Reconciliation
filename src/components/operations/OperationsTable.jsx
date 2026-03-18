import React from 'react';
import {
  TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Box, Typography, Button,
} from '@mui/material';
import { ViewColumn } from '@mui/icons-material';
import OperationRow from './OperationRow';

export default function OperationsTable({ operations }) {
  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
          {operations.length} Operation{operations.length !== 1 ? 's' : ''}
        </Typography>
        <Button size="small" startIcon={<ViewColumn />} variant="outlined" sx={{ fontSize: 13, borderColor: 'rgba(0,0,0,0.2)', color: 'text.secondary' }}>
          View columns
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ '& th': { bgcolor: '#F8F8FA', fontWeight: 700, fontSize: 12, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 } }}>
              <TableCell>Date / Source / Server</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary', fontSize: 14 }}>
                  No operations match your search.
                </TableCell>
              </TableRow>
            ) : (
              operations.map((op) => <OperationRow key={op.id} operation={op} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
