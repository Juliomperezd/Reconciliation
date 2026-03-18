import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, IconButton,
  FormControl, InputLabel, Tooltip,
} from '@mui/material';
import { Settings, FileDownload } from '@mui/icons-material';
import { days as initialDays, tenders as initialTenders, initialComments } from '../../data/dummy';
import DateStrip from './DateStrip';
import TenderTable from './TenderTable';
import DatePickerModal from '../modals/DatePickerModal';
import AddTenderModal from '../modals/AddTenderModal';
import SundayAIModal from '../modals/SundayAIModal';
import ChatSidebar from '../chat/ChatSidebar';

export default function DailyReportsPageSidebar() {
  const [days] = useState(initialDays);
  const [selectedDayId, setSelectedDayId] = useState('2026-03-10');
  const [tenders, setTenders] = useState(initialTenders);
  const [viewBy, setViewBy] = useState('Tender');
  const [comments, setComments] = useState(initialComments);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [addTenderOpen, setAddTenderOpen] = useState(false);
  const [editTender, setEditTender] = useState(null);
  const [sundayAIOpen, setSundayAIOpen] = useState(false);

  const selectedDay = days.find((d) => d.id === selectedDayId);
  const selectedDayHasIssues = selectedDay?.status === 'warning';

  const handleUpdateTender = (tenderId, newDeclared) => {
    setTenders((prev) =>
      prev.map((t) =>
        t.id === tenderId
          ? { ...t, totalDeclared: newDeclared, delta: t.totalInToast - newDeclared, status: t.totalInToast === newDeclared ? 'ok' : 'warning' }
          : t
      )
    );
  };

  const handleAddTender = ({ name, icon, posId }) => {
    setTenders((prev) => [...prev, {
      id: `custom-${Date.now()}`,
      name, icon, posId,
      totalInToast: 0, totalDeclared: 0, delta: 0, status: 'ok',
    }]);
  };

  const handleSaveEditTender = ({ name, icon, posId }) => {
    setTenders((prev) =>
      prev.map((t) => t.id === editTender.id ? { ...t, name, icon, posId } : t)
    );
    setEditTender(null);
  };

  const handleAISolved = (aiComment) => {
    setComments((prev) => [...prev, aiComment]);
  };

  const handleSendComment = (message) => {
    setComments((prev) => [...prev, {
      id: `c-${Date.now()}`,
      author: { name: 'Sarah Miller', initials: 'SM', color: '#E91E8C', role: 'Manager' },
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      message,
      isAI: false,
    }]);
  };

  return (
    <Box sx={{ pt: 3.5, pr: 1, pb: 4, pl: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 3, px: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1, fontSize: { xs: 20, md: 26 } }}>
          Daily Reports
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>View by</InputLabel>
          <Select value={viewBy} label="View by" onChange={(e) => setViewBy(e.target.value)}>
            <MenuItem value="Tender">Tender</MenuItem>
            <MenuItem value="Server">Server</MenuItem>
            <MenuItem value="Payment method">Payment method</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Settings">
          <IconButton><Settings /></IconButton>
        </Tooltip>
        <Button variant="contained" startIcon={<FileDownload />} sx={{ bgcolor: '#E0E0E0', color: '#555', boxShadow: 'none', '&:hover': { bgcolor: '#D0D0D0', boxShadow: 'none' } }}>
          Export
        </Button>
      </Box>

      {/* DateStrip — single card full width */}
      <Box
        sx={{
          mx: 0,
          mb: 1,
          bgcolor: '#fff',
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.09)',
          px: 0,
          py: 0,
        }}
      >
        <DateStrip
          days={days}
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
          onSeeAll={() => setDatePickerOpen(true)}
          unified
        />
      </Box>

      {/* Two-column layout */}
      <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
        {/* Tender card */}
        <Box
          sx={{
            flex: 1,
            bgcolor: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.09)',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ mx: -2 }}>
            <TenderTable
              tenders={tenders}
              onUpdateTender={handleUpdateTender}
              onAddTender={() => setAddTenderOpen(true)}
              onEditTender={(t) => setEditTender(t)}
            />
          </Box>
        </Box>

        {/* Chat sidebar */}
        <ChatSidebar
          comments={comments}
          onSend={handleSendComment}
          hasIssues={selectedDayHasIssues}
          onAnalyze={() => setSundayAIOpen(true)}
        />
      </Box>

      {/* Modals */}
      <DatePickerModal
        open={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        days={days}
        selectedDayId={selectedDayId}
        onSelectDay={(id) => { setSelectedDayId(id); setDatePickerOpen(false); }}
      />
      <AddTenderModal
        open={addTenderOpen}
        onClose={() => setAddTenderOpen(false)}
        onSubmit={handleAddTender}
      />
      <AddTenderModal
        open={!!editTender}
        onClose={() => setEditTender(null)}
        onSubmit={handleSaveEditTender}
        initialValues={editTender}
      />
      <SundayAIModal
        open={sundayAIOpen}
        onClose={() => setSundayAIOpen(false)}
        onSolved={handleAISolved}
        onUndo={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
      />
    </Box>
  );
}
