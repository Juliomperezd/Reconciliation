import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import { Send, CheckCircle, ExpandMore, AutoFixHigh } from '@mui/icons-material';

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingState() {
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2.5,
      px: 3,
    }}>
      <CircularProgress size={28} thickness={3} sx={{ color: '#FF17E9' }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>
          Analyzing your day{'·'.repeat(dot)}
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#aaa', mt: 0.5 }}>
          Please wait a few seconds
        </Typography>
      </Box>
    </Box>
  );
}

// ── Single task block ─────────────────────────────────────────────────────────
function TaskBlock({ number, title, optional = false, done = false, children }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{
      border: `1px solid ${done ? 'rgba(76,175,80,0.2)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: '12px',
      overflow: 'hidden',
      bgcolor: done ? 'rgba(76,175,80,0.03)' : '#fff',
    }}>
      {/* Tappable header */}
      <Box
        onClick={() => !done && setOpen((o) => !o)}
        sx={{
          px: 2, py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: done ? 'default' : 'pointer',
          userSelect: 'none',
          '&:hover': !done ? { bgcolor: 'rgba(0,0,0,0.02)' } : {},
        }}
      >
        {done
          ? <CheckCircle sx={{ fontSize: 18, color: '#4CAF50', flexShrink: 0 }} />
          : (
            <Box sx={{
              width: 22, height: 22, borderRadius: '50%',
              bgcolor: '#1A1A2E', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
              {number}
            </Box>
          )
        }
        <Typography sx={{
          fontSize: 13, fontWeight: 600,
          color: done ? '#aaa' : '#1A1A2E',
          flexGrow: 1,
          textDecoration: done ? 'line-through' : 'none',
        }}>
          {title}
        </Typography>
        {optional && !done && (
          <Typography sx={{ fontSize: 10, color: '#ccc', fontWeight: 500 }}>
            Optional
          </Typography>
        )}
        {!done && (
          <ExpandMore sx={{
            fontSize: 18, color: '#bbb', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }} />
        )}
      </Box>

      {/* Expandable content */}
      {open && !done && (
        <Box sx={{ px: 2, pb: 2 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

// ── Issues task content ───────────────────────────────────────────────────────
function IssuesTaskContent({ onAnalyze }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <AutoFixHigh sx={{ color: '#C2410C', fontSize: 15, flexShrink: 0, mt: 0.15 }} />
        <Typography sx={{ color: '#C2410C', fontSize: 12 }}>
          We found some issues between POS and declared amounts.
        </Typography>
      </Box>
      <Box
        onClick={onAnalyze}
        sx={{
          display: 'inline-flex', alignItems: 'center',
          px: 1.5, py: 0.5, bgcolor: '#9A3412', color: '#fff',
          borderRadius: 1.5, fontSize: 12, fontWeight: 600,
          cursor: 'pointer', width: 'fit-content',
          '&:hover': { bgcolor: '#7C2D12' },
        }}
      >
        Analyze with sundayAI
      </Box>
    </Box>
  );
}

// ── Comment task content ──────────────────────────────────────────────────────
function CommentTaskContent({ onSend, onDone }) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    onDone();
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Leave a note for your team…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px', fontSize: 13,
            '& fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
          },
        }}
      />
      <IconButton
        onClick={handleSend}
        disabled={!value.trim()}
        size="small"
        sx={{
          bgcolor: '#000', color: '#fff', borderRadius: '8px', p: 1, flexShrink: 0,
          '&:hover': { bgcolor: '#222' },
          '&.Mui-disabled': { bgcolor: '#eee', color: '#bbb' },
        }}
      >
        <Send sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function TasksPanel({ hasIssues, onAnalyze, onSend }) {
  const [loading, setLoading] = useState(true);
  const [issuesDone, setIssuesDone] = useState(false);
  const [commentDone, setCommentDone] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  const totalTasks = hasIssues ? 2 : 1;
  const doneTasks = (hasIssues ? (issuesDone ? 1 : 0) : 0) + (commentDone ? 1 : 0);

  return (
    <Box sx={{
      width: 300,
      flexShrink: 0,
      borderRadius: '16px',
      border: '1px solid rgba(0,0,0,0.09)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: [
        'radial-gradient(ellipse at 0% 0%, rgba(255,23,233,0.14) 0%, transparent 28%)',
        'radial-gradient(ellipse at 70% 0%, rgba(255,150,190,0.08) 0%, transparent 22%)',
        'radial-gradient(ellipse at 100% 0%, rgba(160,190,255,0.09) 0%, transparent 24%)',
        'radial-gradient(ellipse at 30% 0%, rgba(255,180,100,0.06) 0%, transparent 18%)',
        '#ffffff',
      ].join(', '),
    }}>
      {/* Header */}
      <Box sx={{ px: 2, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>Today's tasks</Typography>
          <Typography sx={{ fontSize: 11, color: '#aaa', mt: 0.25 }}>
            {loading ? 'Analyzing…' : validated ? 'Day validated' : `${doneTasks}/${totalTasks} completed`}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 10, color: '#aaa', fontWeight: 500 }}>Powered by SundayAI</Typography>
      </Box>

      {loading ? <LoadingState /> : (
        <>
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Task 1 — Issues (only when hasIssues) */}
            {hasIssues && (
              <TaskBlock number={1} title="Review issues" done={issuesDone}>
                <IssuesTaskContent onAnalyze={() => { onAnalyze(); setIssuesDone(true); }} />
              </TaskBlock>
            )}

            {/* Task 2 — Add comment (optional) */}
            <TaskBlock number={hasIssues ? 2 : 1} title="Add a comment for your team" optional done={commentDone}>
              <CommentTaskContent onSend={onSend} onDone={() => setCommentDone(true)} />
            </TaskBlock>
          </Box>

          {/* Validate button */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Box
              onClick={() => !validated && setValidated(true)}
              sx={{
                width: '100%',
                py: 1.25,
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                bgcolor: validated ? 'rgba(76,175,80,0.1)' : '#1A1A2E',
                color: validated ? '#4CAF50' : '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: validated ? 'default' : 'pointer',
                transition: 'all 0.2s',
                '&:hover': !validated ? { bgcolor: '#2d2d4e' } : {},
              }}
            >
              {validated && <CheckCircle sx={{ fontSize: 16 }} />}
              {validated ? 'Day validated' : 'Validate the day'}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
