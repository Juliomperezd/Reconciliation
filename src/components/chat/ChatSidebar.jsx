import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Avatar, Chip } from '@mui/material';
import { Send, AutoFixHigh } from '@mui/icons-material';

function Message({ msg }) {
  const isOwn = !msg.isAI && msg.author?.name === 'Sarah Miller';
  const isAI = msg.isAI;

  if (isOwn) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box>
          <Typography sx={{ fontSize: 10, color: '#bbb', mb: 0.25, textAlign: 'right' }}>
            You · {msg.time}
          </Typography>
          <Box sx={{ bgcolor: '#000', borderRadius: '14px 14px 4px 14px', px: 1.75, py: 1 }}>
            <Typography sx={{ fontSize: 13, color: '#fff' }}>{msg.message}</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <Avatar
        sx={{
          width: 26, height: 26, flexShrink: 0,
          bgcolor: isAI ? '#FF17E9' : (msg.author?.color || '#999'),
          fontSize: 10, fontWeight: 700,
        }}
      >
        {isAI ? 'AI' : msg.author?.initials}
      </Avatar>
      <Box sx={{ maxWidth: '85%' }}>
        <Typography sx={{ fontSize: 10, color: '#bbb', mb: 0.25 }}>
          {isAI ? 'SundayAI' : msg.author?.name} · {msg.time}
        </Typography>
        <Box sx={{
          bgcolor: isAI ? 'rgba(255,23,233,0.05)' : '#F3F3F5',
          borderRadius: '4px 14px 14px 14px',
          px: 1.75, py: 1,
        }}>
          <Typography sx={{ fontSize: 13, color: '#1A1A2E' }}>{msg.message}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function ChatSidebar({ comments, onSend, hasIssues, onAnalyze }) {
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState('all');
  const bottomRef = useRef(null);

  const aiCount = comments.filter((m) => m.isAI).length;
  const teamCount = comments.filter((m) => !m.isAI).length;

  const filtered = comments.filter((m) => {
    if (filter === 'ai') return m.isAI;
    if (filter === 'team') return !m.isAI;
    return true;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length]);

  const handleSend = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setComment('');
  };

  const chips = [
    { key: 'all', label: 'All', count: comments.length },
    { key: 'ai', label: 'Sunday AI', count: aiCount },
    { key: 'team', label: 'Team', count: teamCount },
  ];

  return (
    <Box sx={{
      width: 320,
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
      {/* Header with gradient — taller so it doesn't get clipped */}
      <Box sx={{
        px: 2, pt: 2.5, pb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        background: 'transparent',
      }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>Team chat</Typography>
        <Typography sx={{ fontSize: 10, color: '#aaa', fontWeight: 500 }}>
          Powered by SundayAI
        </Typography>
      </Box>

      {/* Filter chips */}
      <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 0.75, flexShrink: 0 }}>
        {chips.map((c) => (
          <Chip
            key={c.key}
            label={`${c.label} ${c.count}`}
            size="small"
            onClick={() => setFilter(c.key)}
            sx={{
              fontSize: 12,
              fontWeight: filter === c.key ? 700 : 400,
              bgcolor: filter === c.key ? '#000' : 'rgba(0,0,0,0.05)',
              color: filter === c.key ? '#fff' : '#555',
              border: 'none', height: 26, cursor: 'pointer',
              '&:hover': { bgcolor: filter === c.key ? '#000' : 'rgba(0,0,0,0.09)' },
            }}
          />
        ))}
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </Box>

      {/* Issues block — bottom, only when hasIssues */}
      {hasIssues && (
        <Box sx={{
          mx: 1.5, mt: 1,
          borderRadius: 2,
          border: '1px solid rgba(0,0,0,0.07)',
          overflow: 'hidden',
          flexShrink: 0,
          background: [
            'radial-gradient(ellipse at 10% 60%, rgba(251,146,60,0.09) 0%, transparent 55%)',
            'radial-gradient(ellipse at 90% 10%, rgba(248,113,113,0.07) 0%, transparent 45%)',
            '#FFF7ED',
          ].join(', '),
        }}>
          <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <AutoFixHigh sx={{ color: '#C2410C', fontSize: 16, flexShrink: 0, mt: 0.2 }} />
            <Box>
              <Typography sx={{ color: '#9A3412', fontSize: 13, fontWeight: 700 }}>
                Issues detected
              </Typography>
              <Typography sx={{ color: '#C2410C', fontSize: 12, mt: 0.25 }}>
                We found some issues between POS and declared amounts.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ px: 2, pb: 1.5, pl: '44px' }}>
            <Box
              onClick={onAnalyze}
              sx={{
                display: 'inline-flex', alignItems: 'center',
                px: 1.5, py: 0.5,
                bgcolor: '#9A3412', color: '#fff',
                borderRadius: 1.5, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', width: 'fit-content',
                '&:hover': { bgcolor: '#7C2D12' },
              }}
            >
              Analyze with sundayAI
            </Box>
          </Box>
        </Box>
      )}

      {/* Comment input — outside the issues block */}
      <Box sx={{ px: 1.5, py: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Add a comment…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2, fontSize: 13,
              '& fieldset': { borderColor: 'rgba(0,0,0,0.12)' },
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!comment.trim()}
          size="small"
          sx={{
            bgcolor: '#000', color: '#fff', borderRadius: 1.5, p: 1, flexShrink: 0,
            '&:hover': { bgcolor: '#222' },
            '&.Mui-disabled': { bgcolor: '#eee', color: '#bbb' },
          }}
        >
          <Send sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
