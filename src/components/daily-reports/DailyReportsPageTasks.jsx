import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, IconButton,
  FormControl, InputLabel, Tooltip, CircularProgress,
} from '@mui/material';
import { Settings, FileDownload, Check } from '@mui/icons-material';
import { days as initialDays, tenders as initialTenders, initialComments } from '../../data/dummy';
import DateStrip from './DateStrip';
import TenderTable from './TenderTable';
import DatePickerModal from '../modals/DatePickerModal';
import AddTenderModal from '../modals/AddTenderModal';
import ReportModal from '../modals/ReportModal';
import TasksPanel from '../tasks/TasksPanel';
import { CreditCardOff, SyncProblem, EditOff } from '@mui/icons-material';

const ANALYSIS_ISSUES = [
  { icon: <CreditCardOff />, count: '4', label: 'payments not notified to POS', amount: '€312.50' },
  { icon: <CreditCardOff />, count: '1', label: 'PDQ payment not notified', amount: '€95.20' },
  { icon: <EditOff />, count: '2', label: 'manual manipulations', amount: null },
];

export default function DailyReportsPageTasks() {
  const [days] = useState(initialDays);
  const [selectedDayId, setSelectedDayId] = useState('2026-03-10');
  const [tenders, setTenders] = useState(initialTenders);
  const [viewBy, setViewBy] = useState('Tender');
  const [comments, setComments] = useState(initialComments);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [addTenderOpen, setAddTenderOpen] = useState(false);
  const [editTender, setEditTender] = useState(null);
  const [analysisState, setAnalysisState] = useState(null); // null | 'running' | 'done'
  const [reportOpen, setReportOpen] = useState(false);

  const handleRunAnalysis = () => {
    setAnalysisState('running');
    setTimeout(() => { setAnalysisState('done'); setReportOpen(true); }, 2800);
  };

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
        {/* Tender card — 2/3 */}
        <Box sx={{ flex: 2, bgcolor: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.09)', p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mx: -2 }}>
            <TenderTable
              tenders={tenders}
              onUpdateTender={handleUpdateTender}
              onAddTender={() => setAddTenderOpen(true)}
              onEditTender={(t) => setEditTender(t)}
            />
          </Box>
        </Box>

        {/* Tasks panel — 1/3 */}
        <TasksPanel
          hasIssues={selectedDayHasIssues}
          onAnalyze={handleRunAnalysis}
          onSend={handleSendComment}
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
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} issues={ANALYSIS_ISSUES} />

      {/* Floating analysis feedback — top right */}
      {analysisState && (
        <Box sx={{
          position: 'fixed', top: 24, right: 24,
          zIndex: 1500,
          bgcolor: '#1A1A2E', color: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          px: 2.5, py: 2,
          minWidth: 240,
          animation: 'fadeDown 0.25s ease-out',
          '@keyframes fadeDown': {
            from: { opacity: 0, transform: 'translateY(-8px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              {analysisState === 'running'
                ? <CircularProgress size={15} thickness={4} sx={{ color: '#fff', flexShrink: 0 }} />
                : <Check sx={{ fontSize: 16, color: '#4CAF50', flexShrink: 0 }} />
              }
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                  {analysisState === 'running' ? 'Running analysis…' : 'Analysis complete'}
                </Typography>
                <Typography
                  onClick={analysisState === 'done' ? () => setReportOpen(true) : undefined}
                  sx={{ fontSize: 11, color: analysisState === 'done' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)', mt: 0.4, cursor: analysisState === 'done' ? 'pointer' : 'default', textDecoration: analysisState === 'done' ? 'underline' : 'none' }}
                >
                  {analysisState === 'running' ? 'We will let you know when is ready' : 'View report →'}
                </Typography>
              </Box>
            </Box>
            {analysisState === 'done' && (
              <Box onClick={() => setAnalysisState(null)} sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#fff' }, fontSize: 18, lineHeight: 1, mt: 0.25 }}>
                ×
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
