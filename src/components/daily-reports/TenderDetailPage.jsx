import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Button, TextField, Select, MenuItem,
  InputAdornment, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Chip, FormControl, InputLabel, Tooltip,
} from '@mui/material';
import {
  ArrowBack, Search, FileDownload, Add, MoreVert,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { tenders } from '../../data/dummy';

const PAYMENTS = [
  { id: 'p1',  time: '14:01', date: '18/03/2026', source: '85',  sourceType: 'PDQ', serial: '1852796766', waiter: '22-ALZIRA',  card: { brand: 'MC',   last4: '6063' }, tips: null,   subtotal: 51.80, total: 51.80, status: 'Failed',     posStatus: null },
  { id: 'p2',  time: '13:59', date: '18/03/2026', source: '69',  sourceType: 'PDQ', serial: '1852049885', waiter: '07-ETIENNE', card: { brand: 'VISA', last4: '3268' }, tips: 1.20,   subtotal: 26.80, total: 28.00, status: 'Successful', posStatus: 'Notified' },
  { id: 'p3',  time: '13:59', date: '18/03/2026', source: '69',  sourceType: 'PDQ', serial: '1852049885', waiter: '07-ETIENNE', card: { brand: 'VISA', last4: '6739' }, tips: 1.20,   subtotal: 23.80, total: 25.00, status: 'Successful', posStatus: 'Notified' },
  { id: 'p4',  time: '13:58', date: '18/03/2026', source: '302', sourceType: 'QR',  serial: null,         waiter: '16-OUMAR',  card: { brand: 'VISA', last4: '8091' }, tips: null,   subtotal: 9.60,  total: 10.29, status: 'Successful', posStatus: 'Notified' },
  { id: 'p5',  time: '13:58', date: '18/03/2026', source: '70',  sourceType: 'PDQ', serial: '1852049885', waiter: '07-ETIENNE', card: { brand: 'VISA', last4: '2956' }, tips: 1.68,   subtotal: 33.50, total: 35.18, status: 'Successful', posStatus: 'Notified' },
  { id: 'p6',  time: '13:57', date: '18/03/2026', source: '13',  sourceType: 'PDQ', serial: '1852796766', waiter: '05-MOURAD', card: { brand: 'VISA', last4: '1677' }, tips: 2.70,   subtotal: 43.30, total: 46.00, status: 'Successful', posStatus: 'Notified' },
  { id: 'p7',  time: '13:57', date: '18/03/2026', source: '511', sourceType: 'PDQ', serial: '1854471197', waiter: '23-MARC',   card: { brand: 'MC',   last4: '6280' }, tips: 2.83,   subtotal: 56.60, total: 59.43, status: 'Successful', posStatus: 'Notified' },
  { id: 'p8',  time: '13:57', date: '18/03/2026', source: '731', sourceType: 'QR',  serial: null,         waiter: '41-NIDAL',  card: { brand: 'VISA', last4: '4553' }, tips: 1.00,   subtotal: 38.10, total: 40.09, status: 'Successful', posStatus: 'Notified' },
  { id: 'p9',  time: '13:57', date: '18/03/2026', source: '302', sourceType: 'QR',  serial: null,         waiter: '16-OUMAR',  card: { brand: 'VISA', last4: '9662' }, tips: null,   subtotal: 9.90,  total: 10.59, status: 'Successful', posStatus: 'Notified' },
  { id: 'p10', time: '13:56', date: '18/03/2026', source: '44',  sourceType: 'PDQ', serial: '1852049885', waiter: '07-ETIENNE', card: { brand: 'VISA', last4: '1234' }, tips: 3.50,   subtotal: 62.00, total: 65.50, status: 'Refunded',   posStatus: 'Notified' },
];

const STATUS_OPTIONS = ['All', 'Successful', 'Failed', 'Refunded'];
const GROUP_OPTIONS = ['Payment', 'Bill', 'Server', 'Table'];

function CardBadge({ brand }) {
  const colors = { VISA: '#1a1f71', MC: '#eb001b' };
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 34, height: 22, borderRadius: '4px',
      bgcolor: colors[brand] || '#999',
      color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em',
    }}>
      {brand}
    </Box>
  );
}

function StatusChip({ status }) {
  const map = {
    Successful: { bg: 'rgba(76,175,80,0.12)', color: '#2E7D32' },
    Failed:     { bg: 'rgba(244,67,54,0.12)', color: '#C62828' },
    Refunded:   { bg: 'rgba(255,152,0,0.12)', color: '#E65100' },
  };
  const s = map[status] || { bg: '#eee', color: '#555' };
  return (
    <Chip label={status} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: 12, border: 'none' }} />
  );
}

export default function TenderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const tender = tenders.find((t) => t.id === id);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [groupBy, setGroupBy] = useState('Payment');

  const filtered = PAYMENTS.filter((p) => {
    const matchStatus = status === 'All' || p.status === status;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.waiter.toLowerCase().includes(q) ||
      p.card.last4.includes(q) ||
      p.source.includes(q) ||
      p.total.toString().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <Box sx={{ pt: 3.5, pr: 1, pb: 4, pl: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, px: 3 }}>
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBack />
        </IconButton>
        <Typography sx={{ fontSize: 22 }}>{tender?.icon}</Typography>
        <Typography variant="h4" sx={{ flexGrow: 1, fontSize: { xs: 20, md: 26 } }}>
          {tender?.name ?? id}
        </Typography>
      </Box>

      {/* Card */}
      <Box sx={{ flex: 1, bgcolor: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', flexDirection: 'column' }}>
        {/* Filters row */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          {/* Status */}
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}
              sx={{ borderRadius: '8px', fontSize: 13 }}>
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search by amount, waiter, card…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: '#bbb' }} /></InputAdornment> }}
            sx={{ flex: 1, minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13 } }}
          />

          {/* Add filter */}
          <Button size="small" startIcon={<Add />} variant="outlined"
            sx={{ borderRadius: '8px', fontSize: 12, borderColor: 'rgba(0,0,0,0.18)', color: '#555', whiteSpace: 'nowrap', '&:hover': { borderColor: '#000', bgcolor: 'transparent' } }}>
            Add filter
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {/* Group by */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Group by</InputLabel>
            <Select value={groupBy} label="Group by" onChange={(e) => setGroupBy(e.target.value)}
              sx={{ borderRadius: '8px', fontSize: 13 }}>
              {GROUP_OPTIONS.map((g) => <MenuItem key={g} value={g}>Group by: {g}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Export */}
          <Button size="small" variant="contained" startIcon={<FileDownload />}
            sx={{ bgcolor: '#1A1A2E', color: '#fff', borderRadius: '8px', fontSize: 12, whiteSpace: 'nowrap', boxShadow: 'none', '&:hover': { bgcolor: '#2d2d4e', boxShadow: 'none' } }}>
            Export CSV
          </Button>
        </Box>

        {/* Date label */}
        <Box sx={{ py: 1.5, textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#333' }}>18 March 2026</Typography>
          <Typography sx={{ fontSize: 11, color: '#aaa' }}>04:00 – 03:59</Typography>
        </Box>

        {/* Table */}
        <TableContainer sx={{ flex: 1 }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ '& th': { fontSize: 11, color: 'rgba(0,0,0,0.38)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, py: 1.25, borderBottom: '1px solid rgba(0,0,0,0.06)', bgcolor: '#fff' } }}>
                <TableCell sx={{ width: 40 }} />
                <TableCell>Date & time</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Waiter</TableCell>
                <TableCell>Payment method</TableCell>
                <TableCell align="right">Tips</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>POS Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} sx={{ '& td': { py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 13 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                  <TableCell />
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{p.time}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#aaa' }}>{p.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{p.source}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#aaa' }}>{p.sourceType}{p.serial ? `\n${p.serial}` : ''}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{p.waiter}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CardBadge brand={p.card.brand} />
                      <Typography sx={{ fontSize: 13 }}>{p.card.last4}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: p.tips ? '#333' : '#bbb' }}>
                    {p.tips ? `€${p.tips.toFixed(2)}` : '—'}
                  </TableCell>
                  <TableCell align="right">€{p.subtotal.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>€{p.total.toFixed(2)}</TableCell>
                  <TableCell><StatusChip status={p.status} /></TableCell>
                  <TableCell>
                    {p.posStatus
                      ? <Chip label={p.posStatus} size="small" sx={{ bgcolor: 'rgba(76,175,80,0.1)', color: '#2E7D32', fontWeight: 600, fontSize: 12, border: 'none' }} />
                      : <Typography sx={{ color: '#bbb', fontSize: 13 }}>—</Typography>
                    }
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" sx={{ color: '#bbb' }}><MoreVert fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
