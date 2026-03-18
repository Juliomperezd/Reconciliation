import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer, Box, Typography, IconButton, Avatar, TextField,
  Divider, Chip,
} from '@mui/material';
import { Close, Send, AutoFixHigh } from '@mui/icons-material';

export default function CommentsPanel({ open, onClose, comments, onSend }) {
  const [message, setMessage] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments, open]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      hideBackdrop
      disableScrollLock
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400 }, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' } }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Comments</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={`${comments.length}`} size="small" color="primary" />
          <IconButton onClick={onClose} size="small"><Close /></IconButton>
        </Box>
      </Box>

      {/* Comment List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {comments.map((comment) => (
          <Box key={comment.id} sx={{ display: 'flex', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36, height: 36, flexShrink: 0, fontSize: 13, fontWeight: 700,
                bgcolor: comment.isAI ? '#E91E8C' : comment.author.color,
              }}
            >
              {comment.isAI ? <AutoFixHigh sx={{ fontSize: 18 }} /> : comment.author.initials}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{comment.author.name}</Typography>
                {comment.isAI && <Chip label="AI" size="small" color="primary" sx={{ height: 16, fontSize: 10 }} />}
                <Typography sx={{ fontSize: 11, color: 'text.secondary', ml: 'auto' }}>{comment.time}</Typography>
              </Box>
              <Box sx={{ bgcolor: comment.isAI ? 'rgba(233,30,140,0.06)' : '#F5F5F7', borderRadius: 2, px: 2, py: 1.5, borderLeft: comment.isAI ? '3px solid #E91E8C' : 'none' }}>
                <Typography sx={{ fontSize: 13, lineHeight: 1.6 }}>{comment.message}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Divider />

      {/* Comment Input */}
      <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#E91E8C', fontSize: 12, flexShrink: 0 }}>SM</Avatar>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Add a comment..."
          multiline
          maxRows={4}
          fullWidth
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!message.trim()}
          color="primary"
          sx={{ flexShrink: 0 }}
        >
          <Send />
        </IconButton>
      </Box>
    </Drawer>
  );
}
