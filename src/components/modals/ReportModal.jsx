import React, { useState, useEffect } from 'react';
import {
  Dialog, Box, Typography, IconButton, CircularProgress, Collapse,
} from '@mui/material';
import {
  Close, WarningAmber, ExpandMore, OpenInNew, Check, ChevronLeft,
} from '@mui/icons-material';

const MESH_GRADIENT = `
  radial-gradient(ellipse at 0% 0%, rgba(255,23,233,0.13) 0%, transparent 50%),
  radial-gradient(ellipse at 100% 0%, rgba(233,30,140,0.09) 0%, transparent 45%),
  radial-gradient(ellipse at 50% 0%, rgba(255,184,0,0.06) 0%, transparent 55%),
  linear-gradient(to bottom, #fff 0%, #fff 100%)
`.trim();

// ── Generating state ──────────────────────────────────────────────────────────
function GeneratingState() {
  const [step, setStep] = useState(0);
  const steps = ['Fetching POS data…', 'Analyzing payments…', 'Building report…'];
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: MESH_GRADIENT }}>
      <CircularProgress size={36} thickness={2.5} sx={{ color: '#E91E8C' }} />
      <Box sx={{ textAlign: 'center' }}>
        <Box component="img" src="/Images/AI.svg" alt="AI" sx={{ height: 16, display: 'block', mx: 'auto', mb: 1 }} onError={(e) => { e.target.style.display = 'none'; }} />
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>Generating your report</Typography>
        <Typography sx={{ fontSize: 13, color: '#aaa' }}>{steps[step]}</Typography>
      </Box>
    </Box>
  );
}

// ── Delta pill ────────────────────────────────────────────────────────────────
function DeltaPill({ amount }) {
  return (
    <Box sx={{ px: 1, py: 0.2, borderRadius: '100px', bgcolor: 'rgba(251,146,60,0.13)', color: '#9A3412', fontSize: 11, fontWeight: 700, flexShrink: 0, lineHeight: 1.6 }}>
      {amount || '€0.00'}
    </Box>
  );
}

// ── Issue data ────────────────────────────────────────────────────────────────
const ISSUE_DETAILS = {
  0: {
    description: 'These 4 payments were processed through the POS terminal but were never reported back to the reconciliation system. This typically happens when the network drops during the transaction handshake.',
    transactions: ['#TXN-2041 · €78.50', '#TXN-2044 · €112.00', '#TXN-2051 · €65.20', '#TXN-2058 · €56.80'],
    steps: ['Open POS admin panel', 'Go to Transactions → Pending sync', 'Select the 4 affected payments', 'Click "Push to POS" to resync'],
    cta: 'View affected transactions',
  },
  1: {
    description: 'A PDQ card payment was authorized but the confirmation was not received by the system. This happens when the PDQ device loses connectivity right after the customer taps.',
    transactions: ['#TXN-2047 · €95.20'],
    steps: ['Check the PDQ terminal logs', 'Match the authorization code with the POS receipt', 'Manually enter the confirmation in the back office'],
    cta: 'View affected transactions',
  },
  2: {
    description: 'A transaction entered reconciliation more than 48 hours ago and is still unresolved. This needs to be actioned before end-of-day close.',
    transactions: ['#TXN-2039 · €95.20'],
    steps: ['Locate the pending transaction', 'Verify with the relevant team', 'Mark as resolved or escalate'],
    cta: 'View affected transactions',
  },
  3: {
    description: '2 line items were manually edited without a justification reason. Manual edits without justification are flagged for compliance review.',
    transactions: ['Cash tender · –€18.00', 'Gift coin tender · –€12.00'],
    steps: ['Review the edited line items', 'Add a justification comment to each', 'Re-submit for approval'],
    cta: 'Add context as a comment',
  },
};

// ── Issue row ─────────────────────────────────────────────────────────────────
function IssueRow({ count, label, amount, index, selected, onSelect, done, onDone }) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 1.5, py: 1.25, borderRadius: '10px',
        bgcolor: selected ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.04)',
        cursor: 'pointer', transition: 'background-color 0.15s',
        '&:hover': { bgcolor: selected ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.065)' },
      }}
    >
      <Typography
        onClick={onSelect}
        sx={{ fontSize: 13, fontWeight: 600, flexGrow: 1, color: done ? '#bbb' : '#1A1A2E', textDecoration: done ? 'line-through' : 'none' }}
      >
        {count} {label}
      </Typography>
      <Box onClick={onSelect} sx={{ display: 'flex', alignItems: 'center' }}>
        <DeltaPill amount={amount} />
      </Box>
      {/* Done circle */}
      <Box
        onClick={(e) => { e.stopPropagation(); onDone(); }}
        sx={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', cursor: 'pointer', ml: 0.5,
          ...(done ? { bgcolor: '#4CAF50' } : { border: '1.5px solid rgba(0,0,0,0.15)', '&:hover': { borderColor: '#4CAF50' } }),
        }}
      >
        {done && <Check sx={{ fontSize: 12, color: '#fff' }} />}
      </Box>
    </Box>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ issue, index, onClose }) {
  const detail = ISSUE_DETAILS[index] || ISSUE_DETAILS[0];
  return (
    <Box sx={{
      width: 420, flexShrink: 0,
      bgcolor: '#F5F5F7',
      borderLeft: '1px solid rgba(0,0,0,0.07)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      animation: 'slideIn 0.2s ease-out',
      '@keyframes slideIn': { from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
    }}>
      {/* Header */}
      <Box sx={{ px: 3, pt: 3, pb: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', lineHeight: 1.3 }}>
            {issue.count} {issue.label}
          </Typography>
          {issue.amount && (
            <Typography sx={{ fontSize: 11, color: '#E91E8C', fontWeight: 600, mt: 0.5 }}>Impact: {issue.amount}</Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#aaa', mt: -0.5, ml: -1 }}>
          <ChevronLeft />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography sx={{ fontSize: 12, color: '#555', lineHeight: 1.75 }}>{detail.description}</Typography>

        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>Affected transactions</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {detail.transactions.map((tx, i) => (
              <Box key={i} sx={{ px: 1.25, py: 0.9, bgcolor: '#fff', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <Typography sx={{ fontSize: 12, color: '#444', fontWeight: 500 }}>{tx}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>How to resolve</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {detail.steps.map((step, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.1 }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#777' }}>{i + 1}</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>{step}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{
          display: 'inline-flex', alignItems: 'center',
          px: 1.75, py: 0.75, border: '1.5px solid rgba(0,0,0,0.1)', color: '#1A1A2E',
          borderRadius: '100px', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', width: 'fit-content', bgcolor: '#fff',
          '&:hover': { borderColor: 'rgba(0,0,0,0.25)' },
        }}>
          {detail.cta}
        </Box>
      </Box>

      {/* Mark as done */}
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <Box sx={{ width: '100%', py: 1, bgcolor: '#1A1A2E', color: '#fff', borderRadius: '100px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { bgcolor: '#2d2d4e' } }}>
          Mark as done
        </Box>
      </Box>
    </Box>
  );
}

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <Box onClick={() => setOpen((o) => !o)} sx={{ py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: 2, '&:hover': { '& .faq-q': { color: '#E91E8C' } } }}>
        <Typography className="faq-q" sx={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', transition: 'color 0.15s' }}>{question}</Typography>
        <ExpandMore sx={{ fontSize: 18, color: '#bbb', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </Box>
      <Collapse in={open}>
        <Typography sx={{ fontSize: 13, color: '#666', pb: 2, lineHeight: 1.75 }}>{answer}</Typography>
      </Collapse>
    </Box>
  );
}

// ── Learn more link ───────────────────────────────────────────────────────────
function LearnMoreLink({ title, description }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, borderRadius: '10px', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' } }}>
      <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(233,30,140,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <OpenInNew sx={{ fontSize: 14, color: '#E91E8C' }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{title}</Typography>
        <Typography sx={{ fontSize: 11, color: '#aaa', mt: 0.25 }}>{description}</Typography>
      </Box>
    </Box>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const ISSUES = [
  { count: '4', label: 'payments not notified to POS', amount: '€312.50' },
  { count: '1', label: 'PDQ payment not notified', amount: '€95.20' },
  { count: '1', label: 'transaction pending reconciliation', amount: '€95.20' },
  { count: '2', label: 'manual manipulations', amount: null },
];

const FAQS = [
  { question: 'How do I notify the payments to POS?', answer: 'Go to the POS admin panel → Transactions → Pending sync. Select the affected payments and click "Push to POS". The system will attempt to resync up to 3 times. If it fails, contact support.' },
  { question: 'What causes a mismatched tender amount?', answer: 'Mismatches usually occur when a tip is added after the initial authorization, when a refund is partially processed, or when a currency conversion rounding error occurs between systems.' },
  { question: 'How long do I have to reconcile?', answer: 'You have until the end-of-day close (typically midnight local time) to reconcile. After that, the day locks and any adjustments require a manager override.' },
  { question: 'Can I validate a day with open issues?', answer: "Yes, but the system will require a justification comment. Days validated with open issues are flagged for your accounting team's monthly review." },
];

const ARTICLES = [
  { title: 'POS Reconciliation Guide', description: 'Step-by-step walkthrough for daily reconciliation' },
  { title: 'Understanding Tender Types', description: 'Cash, card, gift card and digital wallet differences' },
  { title: 'Manual Override Policy', description: 'When and how to use manual reconciliation overrides' },
  { title: 'End-of-Day Checklist', description: 'Everything you need to close the day correctly' },
];

// ── Main modal ────────────────────────────────────────────────────────────────
export default function ReportModal({ open, onClose, issues: issuesProp }) {
  const [ready, setReady] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [doneMap, setDoneMap] = useState({});

  useEffect(() => {
    if (open) {
      setReady(false);
      setSelectedIndex(null);
      const t = setTimeout(() => setReady(true), 2800);
      return () => clearTimeout(t);
    }
  }, [open]);

  const issues = issuesProp || ISSUES;
  const panelOpen = selectedIndex !== null;

  const toggleDone = (i) => setDoneMap((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '92vw', height: '90vh',
          maxWidth: panelOpen ? 1240 : 800,
          borderRadius: '20px', overflow: 'hidden',
          display: 'flex', flexDirection: 'row',
          transition: 'max-width 0.25s ease',
        },
      }}
    >
      <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', top: 16, right: 16, color: '#888', zIndex: 10, bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: '#fff' } }}>
        <Close fontSize="small" />
      </IconButton>

      {!ready ? <GeneratingState /> : (
        <Box sx={{ flex: 1, overflowY: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Gradient header */}
          <Box sx={{ px: 4, pt: 3.5, pb: 3, background: MESH_GRADIENT }}>
            <Box component="img" src="/Images/AI.svg" alt="AI" sx={{ height: 14, display: 'block', mb: 1 }} onError={(e) => { e.target.style.display = 'none'; }} />
            <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', mb: 0.75 }}>
              Discrepancies report
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#666', lineHeight: 1.8, maxWidth: 520 }}>
              We analyzed <strong>147 payments</strong> across all tender types — cash, card, gift card, and digital wallets.
              Out of those, <strong>10 transactions</strong> require your attention before the day can be validated.
              The total amount at risk is <strong>€455.70</strong>.
            </Typography>
          </Box>

          {/* Issues */}
          <Box sx={{ px: 3, pt: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 0.5 }}>
              <WarningAmber sx={{ fontSize: 15, color: '#888' }} />
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>Issues detected</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {issues.map((issue, i) => (
                <IssueRow
                  key={i}
                  {...issue}
                  index={i}
                  selected={selectedIndex === i}
                  done={!!doneMap[i]}
                  onSelect={() => setSelectedIndex(selectedIndex === i ? null : i)}
                  onDone={() => toggleDone(i)}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.07)', mx: 4, mt: 3 }} />

          {/* FAQ + Learn more */}
          <Box sx={{ px: 4, py: 3.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>Frequently asked questions</Typography>
              <Typography sx={{ fontSize: 12, color: '#aaa', mb: 2 }}>Common questions about today's reconciliation issues</Typography>
              {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
            </Box>
            <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.07)' }} />
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>Learn more</Typography>
              <Typography sx={{ fontSize: 12, color: '#aaa', mb: 1.5 }}>Helpful articles from the Bouillon knowledge base</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                {ARTICLES.map((article, i) => <LearnMoreLink key={i} {...article} />)}
              </Box>
            </Box>
            <Box sx={{ pb: 1 }} />
          </Box>
        </Box>
      )}

      {/* Right panel */}
      {ready && panelOpen && (
        <DetailPanel
          issue={issues[selectedIndex]}
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </Dialog>
  );
}
