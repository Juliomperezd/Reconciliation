import React, { useState } from 'react';
import {
  Box, Typography, TextField, Chip, Button, Alert, IconButton,
  InputAdornment, Divider,
} from '@mui/material';
import { ArrowBack, Search, FilterList, AutoFixHigh, FileDownload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { operations as allOperations } from '../../data/dummy';
import OperationsTable from './OperationsTable';
import FloatingActionBar from '../layout/FloatingActionBar';
import CommentsPanel from '../panels/CommentsPanel';
import HelpPanel from '../panels/HelpPanel';
import { initialComments } from '../../data/dummy';

export default function OperationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [issuesOnly, setIssuesOnly] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const filtered = allOperations.filter((op) => {
    const matchesSearch =
      !search ||
      op.server.toLowerCase().includes(search.toLowerCase()) ||
      op.total.toString().includes(search) ||
      op.source.toLowerCase().includes(search.toLowerCase()) ||
      op.sundayStatus.toLowerCase().includes(search.toLowerCase());
    const matchesIssue = !issuesOnly || op.hasIssue;
    return matchesSearch && matchesIssue;
  });

  const issueCount = allOperations.filter((op) => op.hasIssue).length;

  const handleSendComment = (message) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: { name: 'Sarah Miller', initials: 'SM', color: '#E91E8C', role: 'Manager' },
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      message,
      isAI: false,
    };
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: 12 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 0.5 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontSize: { xs: 20, md: 26 }, mr: 'auto' }}>
          Operations
        </Typography>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search server, amount..."
          size="small"
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
          }}
        />
        <Chip
          icon={<FilterList />}
          label={`Issues only${issueCount > 0 ? ` (${issueCount})` : ''}`}
          onClick={() => setIssuesOnly((v) => !v)}
          color={issuesOnly ? 'warning' : 'default'}
          variant={issuesOnly ? 'filled' : 'outlined'}
          sx={{ fontWeight: 600 }}
        />
        <Button variant="outlined" startIcon={<FileDownload />} sx={{ borderColor: 'rgba(0,0,0,0.2)', color: 'text.secondary' }}>
          Export
        </Button>
      </Box>

      {/* Issue Alert */}
      {issueCount > 0 && (
        <Alert
          severity="warning"
          icon={<AutoFixHigh />}
          sx={{ mb: 2.5, borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" color="warning" onClick={() => setIssuesOnly(true)}>
                See operations
              </Button>
              <Button size="small" variant="contained" color="warning" startIcon={<AutoFixHigh />} sx={{ color: '#fff' }}>
                Solve with sundayAI
              </Button>
            </Box>
          }
        >
          <strong>{issueCount} operations</strong> have issues requiring attention.
        </Alert>
      )}

      <Divider sx={{ mb: 2.5 }} />

      <OperationsTable operations={filtered} />

      {/* Floating Action Bar (Validate disabled on Operations page) */}
      <FloatingActionBar
        commentCount={comments.length}
        onHelp={() => setHelpOpen(true)}
        onComments={() => setCommentsOpen(true)}
        onValidate={() => {}}
        validateDisabled={true}
      />

      <CommentsPanel
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        comments={comments}
        onSend={handleSendComment}
      />
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </Box>
  );
}
