import React, { useState } from 'react';
import {
  Drawer, Box, Typography, IconButton, TextField, Paper, Divider,
} from '@mui/material';
import { Close, Send, Diamond, ChevronRight } from '@mui/icons-material';
import { helpCards } from '../../data/dummy';

export default function HelpPanel({ open, onClose }) {
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleSend = () => {
    if (!question.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { type: 'user', text: question.trim() },
      { type: 'bot', text: 'Thanks for your question! Our support team will get back to you shortly. In the meantime, check the help articles above.' },
    ]);
    setQuestion('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      hideBackdrop
      disableScrollLock
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 400 },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFF0F8',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Diamond sx={{ color: '#E91E8C', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A2E' }}>Need help?</Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: 'rgba(26,26,46,0.6)' }}>
            Browse articles or ask us anything
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2.5, pb: 2 }}>
        {/* Help Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          {helpCards.map((card) => (
            <Paper
              key={card.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(233,30,140,0.15)',
                bgcolor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'all 0.15s',
                '&:hover': { borderColor: '#E91E8C', transform: 'translateX(2px)', boxShadow: '0 4px 12px rgba(233,30,140,0.1)' },
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', mb: 0.3 }}>
                  {card.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'rgba(26,26,46,0.6)' }}>
                  {card.subtitle}
                </Typography>
              </Box>
              <ChevronRight sx={{ color: '#E91E8C', flexShrink: 0 }} />
            </Paper>
          ))}
        </Box>

        {/* Chat Messages */}
        {chatMessages.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            <Divider sx={{ borderColor: 'rgba(233,30,140,0.15)' }}>
              <Typography sx={{ fontSize: 11, color: 'rgba(26,26,46,0.5)' }}>Conversation</Typography>
            </Divider>
            {chatMessages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  bgcolor: msg.type === 'user' ? '#E91E8C' : '#fff',
                  color: msg.type === 'user' ? '#fff' : '#1A1A2E',
                  px: 2, py: 1.5,
                  borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: msg.type === 'bot' ? '1px solid rgba(233,30,140,0.2)' : 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <Typography sx={{ fontSize: 13, lineHeight: 1.6 }}>{msg.text}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(233,30,140,0.15)' }} />

      {/* Input */}
      <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'flex-end', bgcolor: '#FFF0F8' }}>
        <TextField
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask us anything..."
          multiline
          maxRows={3}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#fff',
              '& fieldset': { borderColor: 'rgba(233,30,140,0.2)' },
              '&:hover fieldset': { borderColor: '#E91E8C' },
              '&.Mui-focused fieldset': { borderColor: '#E91E8C' },
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!question.trim()}
          sx={{ color: '#E91E8C', flexShrink: 0, '&.Mui-disabled': { color: 'rgba(233,30,140,0.3)' } }}
        >
          <Send />
        </IconButton>
      </Box>
    </Drawer>
  );
}
