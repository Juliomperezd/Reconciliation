import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Box, IconButton, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails, Checkbox,
  Snackbar, Alert, Chip,
} from '@mui/material';
import { Close, ExpandMore, AutoFixHigh, CheckCircle } from '@mui/icons-material';
import { sundayAIGaps } from '../../data/dummy';

const LOADING_STEPS = [
  'Analyzing POS transactions...',
  'Comparing with Sunday payments...',
  'Identifying discrepancies...',
];

export default function SundayAIModal({ open, onClose, onSolved, onUndo }) {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'results'
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGaps, setSelectedGaps] = useState([1, 2, 3]);
  const [solving, setSolving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lastAICommentId, setLastAICommentId] = useState(null);

  useEffect(() => {
    if (!open) return;
    setPhase('loading');
    setCurrentStep(0);
    setSolving(false);

    const timers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => {
        setCurrentStep(i + 1);
        if (i === LOADING_STEPS.length - 1) {
          setTimeout(() => setPhase('results'), 500);
        }
      }, (i + 1) * 1200)
    );

    return () => timers.forEach(clearTimeout);
  }, [open]);

  const toggleGap = (id) => {
    setSelectedGaps((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]);
  };

  const handleSolve = () => {
    setSolving(true);
    setTimeout(() => {
      const commentId = `ai-${Date.now()}`;
      const aiComment = {
        id: commentId,
        author: { name: 'sundayAI', initials: 'AI', color: '#E91E8C', role: 'AI Assistant' },
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        message: `✅ I've identified and resolved ${selectedGaps.length} gap(s): ${sundayAIGaps.filter(g => selectedGaps.includes(g.id)).map(g => g.title).join('; ')}. Please review the changes and validate when ready.`,
        isAI: true,
      };
      setLastAICommentId(commentId);
      onSolved(aiComment);
      setSolving(false);
      setSnackbarOpen(true);
      onClose();
    }, 2000);
  };

  const handleUndo = () => {
    if (lastAICommentId) {
      onUndo(lastAICommentId);
      setLastAICommentId(null);
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={phase === 'results' ? onClose : undefined}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {/* Pink gradient header */}
        <Box sx={{ background: 'linear-gradient(135deg, #E91E8C 0%, #9C27B0 100%)', px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AutoFixHigh sx={{ color: '#fff', fontSize: 28 }} />
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>sundayAI</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Intelligent reconciliation assistant</Typography>
            </Box>
          </Box>
          {phase === 'results' && (
            <IconButton onClick={onClose} sx={{ color: '#fff' }} size="small"><Close /></IconButton>
          )}
        </Box>

        <DialogContent sx={{ p: 3 }}>
          {phase === 'loading' && (
            <Box sx={{ py: 2 }}>
              <Typography sx={{ fontWeight: 600, mb: 3, fontSize: 15 }}>Analyzing your reconciliation data...</Typography>
              {LOADING_STEPS.map((step, i) => (
                <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {currentStep > i
                    ? <CheckCircle sx={{ color: 'success.main', fontSize: 22 }} />
                    : currentStep === i
                    ? <CircularProgress size={20} thickness={4} />
                    : <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
                  }
                  <Typography sx={{ fontSize: 14, color: currentStep > i ? 'text.primary' : 'text.secondary', fontWeight: currentStep === i ? 600 : 400 }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {phase === 'results' && (
            <Box>
              <Box sx={{ bgcolor: 'rgba(233,30,140,0.06)', borderRadius: 2, p: 2, mb: 2.5, display: 'flex', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #E91E8C, #9C27B0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AutoFixHigh sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
                  I found <strong>{sundayAIGaps.length} gaps</strong> that explain the discrepancy in your reconciliation. Select the ones you want me to resolve.
                </Typography>
              </Box>

              {sundayAIGaps.map((gap) => (
                <Accordion key={gap.id} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px !important', mb: 1, '&:before': { display: 'none' } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 } }}
                  >
                    <Checkbox
                      checked={selectedGaps.includes(gap.id)}
                      onChange={() => toggleGap(gap.id)}
                      onClick={(e) => e.stopPropagation()}
                      color="primary"
                      size="small"
                    />
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{gap.title}</Typography>
                    <Chip label="Gap" size="small" color="warning" sx={{ ml: 'auto', mr: 1, height: 20, fontSize: 10 }} />
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pl: 6 }}>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.7 }}>
                      {gap.detail}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </DialogContent>

        {phase === 'results' && (
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderColor: 'rgba(0,0,0,0.2)', color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button
              onClick={handleSolve}
              variant="contained"
              disabled={solving || selectedGaps.length === 0}
              startIcon={solving ? <CircularProgress size={16} color="inherit" /> : <AutoFixHigh />}
              sx={{ bgcolor: '#E91E8C', '&:hover': { bgcolor: '#c2185b' }, minWidth: 140 }}
            >
              {solving ? 'Solving...' : `Solve ${selectedGaps.length} gap${selectedGaps.length !== 1 ? 's' : ''}`}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
          action={
            <Button color="inherit" size="small" onClick={handleUndo} sx={{ fontWeight: 700 }}>
              UNDO
            </Button>
          }
        >
          Gaps solved! AI comment added to the report.
        </Alert>
      </Snackbar>
    </>
  );
}
