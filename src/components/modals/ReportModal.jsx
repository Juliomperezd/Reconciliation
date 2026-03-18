import React, { useState, useEffect } from 'react';
import {
  Dialog, Box, Typography, IconButton, CircularProgress,
  Collapse,
} from '@mui/material';
import {
  Close, WarningAmber, ExpandMore, OpenInNew,
  CreditCardOff, SyncProblem, AccessTime, PointOfSale,
} from '@mui/icons-material';

// ── Generating state ──────────────────────────────────────────────────────────
function GeneratingState() {
  const [step, setStep] = useState(0);
  const steps = ['Fetching POS data…', 'Analyzing payments…', 'Building report…'];

  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    }}>
      <CircularProgress size={36} thickness={2.5} sx={{ color: '#E91E8C' }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>
          Generating your report
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#aaa' }}>
          {steps[step]}
        </Typography>
      </Box>
      {/* Steps dots */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {steps.map((_, i) => (
          <Box key={i} sx={{
            width: 6, height: 6, borderRadius: '50%',
            bgcolor: i <= step ? '#E91E8C' : 'rgba(0,0,0,0.12)',
            transition: 'background-color 0.3s',
          }} />
        ))}
      </Box>
    </Box>
  );
}

// ── Issue block ───────────────────────────────────────────────────────────────
function IssueBlock({ icon, count, label, amount }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{
      borderRadius: '12px',
      overflow: 'hidden',
      bgcolor: '#F5F5F7',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
      '&:hover': { bgcolor: '#EFEFEF' },
    }}>
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{ px: 2, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.75 }}
      >
        <Box sx={{
          width: 32, height: 32, borderRadius: '8px',
          bgcolor: 'rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {React.cloneElement(icon, { sx: { fontSize: 16, color: '#555' } })}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>{count}</Typography>
            <Typography sx={{ fontSize: 13, color: '#444' }}>{label}</Typography>
          </Box>
          {amount && (
            <Typography sx={{ fontSize: 11, color: '#888', mt: 0.15 }}>Impact: {amount}</Typography>
          )}
        </Box>
        <ExpandMore sx={{
          fontSize: 18, color: '#bbb',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }} />
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 2, pb: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Typography sx={{ fontSize: 12, color: '#666', pt: 1.5, lineHeight: 1.7 }}>
            These payments were processed through the POS terminal but were not reported back to the system.
            This typically happens when the network connection drops during the transaction handshake.
            Review each transaction and manually reconcile or resubmit via the POS admin panel.
          </Typography>
          <Box
            sx={{
              mt: 1.5, display: 'inline-flex', alignItems: 'center',
              px: 1.5, py: 0.5, bgcolor: '#1A1A2E', color: '#fff',
              borderRadius: '100px', fontSize: 11, fontWeight: 600,
              cursor: 'pointer', '&:hover': { opacity: 0.85 },
            }}
          >
            View affected transactions
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', gap: 2,
          '&:hover': { '& .faq-q': { color: '#E91E8C' } },
        }}
      >
        <Typography className="faq-q" sx={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', transition: 'color 0.15s' }}>
          {question}
        </Typography>
        <ExpandMore sx={{
          fontSize: 18, color: '#bbb', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }} />
      </Box>
      <Collapse in={open}>
        <Typography sx={{ fontSize: 13, color: '#666', pb: 2, lineHeight: 1.75 }}>
          {answer}
        </Typography>
      </Collapse>
    </Box>
  );
}

// ── Learn more link ───────────────────────────────────────────────────────────
function LearnMoreLink({ title, description }) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'flex-start', gap: 1.5,
      p: 1.5, borderRadius: '10px', cursor: 'pointer',
      '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
    }}>
      <Box sx={{
        width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(233,30,140,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <OpenInNew sx={{ fontSize: 14, color: '#E91E8C' }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{title}</Typography>
        <Typography sx={{ fontSize: 11, color: '#aaa', mt: 0.25 }}>{description}</Typography>
      </Box>
    </Box>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
const ISSUES = [
  {
    icon: <CreditCardOff />,
    count: '4',
    label: 'payments not notified to POS',
    amount: '€312.50',
    severity: 'warning',
  },
  {
    icon: <SyncProblem />,
    count: '2',
    label: 'tenders with mismatched amounts',
    amount: '€48.00',
    severity: 'warning',
  },
  {
    icon: <AccessTime />,
    count: '1',
    label: 'transaction pending reconciliation',
    amount: '€95.20',
    severity: 'info',
  },
  {
    icon: <PointOfSale />,
    count: '3',
    label: 'manual overrides without justification',
    amount: null,
    severity: 'info',
  },
];

const FAQS = [
  {
    question: 'How do I notify the payments to POS?',
    answer: 'Go to the POS admin panel → Transactions → Pending sync. Select the affected payments and click "Push to POS". The system will attempt to resync up to 3 times. If it fails, contact support.',
  },
  {
    question: 'What causes a mismatched tender amount?',
    answer: 'Mismatches usually occur when a tip is added after the initial authorization, when a refund is partially processed, or when a currency conversion rounding error occurs between systems.',
  },
  {
    question: 'How long do I have to reconcile?',
    answer: 'You have until the end-of-day close (typically midnight local time) to reconcile. After that, the day locks and any adjustments require a manager override.',
  },
  {
    question: 'Can I validate a day with open issues?',
    answer: 'Yes, but the system will require a justification comment. Days validated with open issues are flagged for your accounting team\'s monthly review.',
  },
];

const ARTICLES = [
  { title: 'POS Reconciliation Guide', description: 'Step-by-step walkthrough for daily reconciliation' },
  { title: 'Understanding Tender Types', description: 'Cash, card, gift card and digital wallet differences' },
  { title: 'Manual Override Policy', description: 'When and how to use manual reconciliation overrides' },
  { title: 'End-of-Day Checklist', description: 'Everything you need to close the day correctly' },
];

export default function ReportModal({ open, onClose }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (open) {
      setReady(false);
      const t = setTimeout(() => setReady(true), 2800);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '92vw',
          height: '90vh',
          maxWidth: 860,
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Close button */}
      <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', top: 16, right: 16, color: '#aaa', zIndex: 1 }}>
        <Close fontSize="small" />
      </IconButton>

      {/* Body */}
      {!ready ? (
        <GeneratingState />
      ) : (
        <Box sx={{ flex: 1, overflowY: 'auto', px: 4, py: 3.5, display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Date title + intro */}
          <Box>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', mb: 1 }}>
              March 10, 2026
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#666', lineHeight: 1.8, maxWidth: 600 }}>
              We analyzed <strong>147 payments</strong> across all tender types — cash, card, gift card, and digital wallets.
              Out of those, <strong>10 transactions</strong> require your attention before the day can be validated.
              The total amount at risk is <strong>€455.70</strong>. Below you'll find a breakdown of each issue,
              along with recommended actions to help you resolve them quickly.
            </Typography>
          </Box>

          {/* Issues section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <WarningAmber sx={{ fontSize: 16, color: '#888' }} />
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>Issues detected</Typography>
              <Box sx={{
                ml: 0.5, px: 1, py: 0.1, borderRadius: '100px',
                bgcolor: 'rgba(0,0,0,0.07)', color: '#555', fontSize: 11, fontWeight: 700,
              }}>
                {ISSUES.length}
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
              {ISSUES.map((issue, i) => (
                <IssueBlock key={i} {...issue} />
              ))}
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.07)' }} />

          {/* FAQ section */}
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>
              Frequently asked questions
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#aaa', mb: 2 }}>
              Common questions about today's reconciliation issues
            </Typography>
            <Box>
              {FAQS.map((faq, i) => (
                <FaqItem key={i} {...faq} />
              ))}
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.07)' }} />

          {/* Learn more section */}
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>
              Learn more
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#aaa', mb: 1.5 }}>
              Helpful articles from the Bouillon knowledge base
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
              {ARTICLES.map((article, i) => (
                <LearnMoreLink key={i} {...article} />
              ))}
            </Box>
          </Box>

          {/* Bottom padding */}
          <Box sx={{ pb: 1 }} />
        </Box>
      )}
    </Dialog>
  );
}
