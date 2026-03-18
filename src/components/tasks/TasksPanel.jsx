import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, CircularProgress, Collapse, Divider, circularProgressClasses } from '@mui/material';
import { Send, ExpandMore, Check } from '@mui/icons-material';
import { initialComments } from '../../data/dummy';

// ── Confetti + Done toast ─────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#FF17E9', '#1A1A2E', '#FFB800', '#4CAF50', '#60A5FA', '#F87171', '#A78BFA'];

function DoneBurst({ active }) {
  if (!active) return null;

  const particles = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * 360 + Math.random() * 10;
    const dist = 36 + Math.random() * 32;
    const dx = Math.cos((angle * Math.PI) / 180) * dist;
    const dy = Math.sin((angle * Math.PI) / 180) * dist;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const w = 5 + Math.random() * 5;
    const h = 4 + Math.random() * 4;
    const rotate = Math.random() * 360;
    const delay = Math.random() * 0.08;
    return { dx, dy, color, w, h, rotate, delay };
  });

  return (
    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 20 }}>
      {/* Confetti particles */}
      {particles.map((p, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          width: p.w, height: p.h,
          bgcolor: p.color,
          borderRadius: '1px',
          animation: `cf${i} 0.65s ${p.delay}s ease-out forwards`,
          opacity: 0,
          [`@keyframes cf${i}`]: {
            '0%': { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
            '100%': { transform: `translate(${p.dx}px,${p.dy}px) rotate(${p.rotate}deg)`, opacity: 0 },
          },
        }} />
      ))}
      {/* Done pill */}
      <Box sx={{
        bgcolor: '#1A1A2E', color: '#fff',
        px: 2, py: 0.75, borderRadius: '100px',
        display: 'flex', alignItems: 'center', gap: 0.75,
        fontSize: 13, fontWeight: 700,
        animation: 'donePop 0.65s ease-out forwards',
        '@keyframes donePop': {
          '0%': { transform: 'scale(0.6)', opacity: 0 },
          '30%': { transform: 'scale(1.1)', opacity: 1 },
          '55%': { transform: 'scale(1)', opacity: 1 },
          '85%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.9)', opacity: 0 },
        },
      }}>
        <Check sx={{ fontSize: 14 }} />
        Done!
      </Box>
    </Box>
  );
}

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingState() {
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2.5, px: 3 }}>
      <CircularProgress size={28} thickness={3} sx={{ color: '#FF17E9' }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>Analyzing your day{'·'.repeat(dot)}</Typography>
        <Typography sx={{ fontSize: 12, color: '#aaa', mt: 0.5 }}>Please wait a few seconds</Typography>
      </Box>
    </Box>
  );
}

// ── Sub-task row ──────────────────────────────────────────────────────────────
function SubTask({ label, done, onToggle }) {
  const [burst, setBurst] = useState(false);
  const handleCheck = (e) => {
    e.stopPropagation();
    if (!done) { setBurst(true); setTimeout(() => setBurst(false), 800); }
    onToggle();
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 0.75, position: 'relative' }}>
      <Box onClick={handleCheck} sx={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', cursor: 'pointer',
        ...(done ? { bgcolor: '#4CAF50' } : { border: '1.5px solid rgba(0,0,0,0.18)', '&:hover': { borderColor: '#4CAF50' } }),
      }}>
        {done && <Check sx={{ fontSize: 11, color: '#fff' }} />}
      </Box>
      <Typography sx={{ fontSize: 12, color: done ? '#bbb' : '#444', textDecoration: done ? 'line-through' : 'none', flex: 1 }}>
        {label}
      </Typography>
      {burst && <DoneBurst active />}
    </Box>
  );
}

// ── Task block ────────────────────────────────────────────────────────────────
function TaskBlock({ number, title, subtitle, done, onToggleDone, open, onToggleOpen, delta, fireBurst, bgGradient, loading, children }) {
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (fireBurst) { setBurst(true); setTimeout(() => setBurst(false), 800); }
  }, [fireBurst]);

  const handleCheck = (e) => {
    e.stopPropagation();
    if (!done) { setBurst(true); setTimeout(() => setBurst(false), 800); }
    onToggleDone();
  };

  return (
    <Box sx={{ position: 'relative', ...(bgGradient ? { background: bgGradient } : { bgcolor: done ? 'rgba(0,0,0,0.015)' : 'transparent' }) }}>
      {burst && <DoneBurst active />}

      {/* Header — click row to expand, click circle to mark done */}
      <Box
        onClick={onToggleOpen}
        sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', userSelect: 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
      >
        <ExpandMore
          sx={{ fontSize: 18, color: '#ccc', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: done ? '#bbb' : '#1A1A2E', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.3 }}>
            {title}
          </Typography>
          {subtitle && <Box sx={{ mt: 0.25 }}>{subtitle}</Box>}
        </Box>
        <DeltaBadge delta={delta} />
        {/* Done circle — separate click handler */}
        {loading ? (
          <CircularProgress size={18} thickness={3} sx={{ flexShrink: 0, color: '#E91E8C' }} />
        ) : (
          <Box
            onClick={handleCheck}
            sx={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              ...(done ? { bgcolor: '#4CAF50' } : { border: '1.5px solid rgba(0,0,0,0.15)', '&:hover': { borderColor: '#4CAF50' } }),
            }}
          >
            {done && <Check sx={{ fontSize: 12, color: '#fff' }} />}
          </Box>
        )}
      </Box>

      <Collapse in={open && !done}>
        <Box sx={{ pl: '42px', pr: 2, pb: 2, position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

// ── Nav pill ──────────────────────────────────────────────────────────────────
function NavPill({ tab, setTab, commentCount }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '100px', p: 0.4, width: '100%' }}>
      {['Tasks', 'Comments'].map((t) => (
        <Box key={t} onClick={() => setTab(t)} sx={{
          flex: 1, py: 0.5, borderRadius: '100px',
          fontSize: 12, fontWeight: tab === t ? 700 : 500,
          color: tab === t ? '#1A1A2E' : '#999',
          bgcolor: tab === t ? '#fff' : 'transparent',
          boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.6,
          transition: 'all 0.15s', userSelect: 'none',
        }}>
          {t}
          {t === 'Comments' && <Box component="span" sx={{ color: tab === t ? '#aaa' : '#bbb', fontWeight: 400 }}>· {commentCount}</Box>}
        </Box>
      ))}
    </Box>
  );
}

// ── Comments view ─────────────────────────────────────────────────────────────
function CommentsView({ comments, onSend, inputRef }) {
  const [value, setValue] = useState('');
  const handleSend = () => { if (!value.trim()) return; onSend(value.trim()); setValue(''); };
  return (
    <>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {comments.map((c) => (
          <Box key={c.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, bgcolor: c.author.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
              {c.author.initials}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1A1A2E' }}>{c.author.name}</Typography>
                <Typography sx={{ fontSize: 10, color: '#bbb' }}>{c.time}</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: '#555', mt: 0.25, lineHeight: 1.5 }}>{c.message}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 1 }}>
        <TextField inputRef={inputRef} fullWidth size="small" placeholder="Leave a note…" value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: 13, '& fieldset': { borderColor: 'rgba(0,0,0,0.12)' } } }}
        />
        <IconButton onClick={handleSend} disabled={!value.trim()} size="small" sx={{ bgcolor: '#000', color: '#fff', borderRadius: '8px', p: 1, flexShrink: 0, '&:hover': { bgcolor: '#222' }, '&.Mui-disabled': { bgcolor: '#eee', color: '#bbb' } }}>
          <Send sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
function DeltaBadge({ delta }) {
  if (delta === 0 || delta == null) return null;
  return (
    <Box sx={{
      px: 1, py: 0.2, borderRadius: '100px',
      bgcolor: 'rgba(251,146,60,0.13)', color: '#9A3412',
      fontSize: 11, fontWeight: 700, flexShrink: 0, lineHeight: 1.5,
    }}>
      €{Math.abs(delta).toFixed(2)}
    </Box>
  );
}

export default function TasksPanel({ hasIssues, onAnalyze, onSend, onSameAsPOS, tenders = [] }) {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Tasks');
  const [done, setDone] = useState([false, false, false]);
  const [openTask, setOpenTask] = useState(0); // index of expanded task
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [subDone, setSubDone] = useState([false, false, false]);
  const [validated, setValidated] = useState(false);
  const [sameAsPOSDone, setSameAsPOSDone] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const commentInputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  // Auto-open first non-done task
  useEffect(() => {
    const first = done.findIndex((d) => !d);
    if (first !== -1) setOpenTask(first);
  }, [done]);

  const toggleDone = (i) => setDone((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  const toggleSub = (i) => setSubDone((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });

  const goToComments = () => {
    setTab('Comments');
    setTimeout(() => commentInputRef.current?.focus(), 50);
  };

  const handleSendComment = (msg) => {
    onSend(msg);
    setComments((prev) => [...prev, {
      id: `c-${Date.now()}`,
      author: { name: 'Sarah Miller', initials: 'SM', color: '#E91E8C', role: 'Manager' },
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      message: msg, isAI: false,
    }]);
  };

  const SUB_TASKS = [
    '4 payments not notified to POS',
    'PDQ payment not notified',
    '2 manual manipulations',
  ];

  const sundayQrDelta = tenders.find((t) => t.id === 'sunday-qr')?.delta ?? 0;
  const sundayPdqDelta = tenders.find((t) => t.id === 'sunday-pdq')?.delta ?? 0;
  const nonSundayDelta = tenders.filter((t) => t.id !== 'sunday-qr' && t.id !== 'sunday-pdq').reduce((sum, t) => sum + (t.delta || 0), 0);
  const sundayDelta = sundayQrDelta + sundayPdqDelta;
  const subDeltas = [sundayQrDelta, sundayPdqDelta, nonSundayDelta];

  return (
    <Box sx={{ flex: 1, bgcolor: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', mb: 1.5 }}>
          My report
        </Typography>
        <NavPill tab={tab} setTab={setTab} commentCount={comments.length} />
      </Box>

      {loading ? <LoadingState /> : tab === 'Comments' ? (
        <CommentsView comments={comments} onSend={handleSendComment} inputRef={commentInputRef} />
      ) : (
        <>

          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* Task 1 — Review the tender lines */}
            <TaskBlock number={1} title="Review non-sunday tenders" done={done[0]} onToggleDone={() => toggleDone(0)} open={openTask === 0} onToggleOpen={() => setOpenTask(openTask === 0 ? -1 : 0)} delta={sameAsPOSDone ? 0 : nonSundayDelta} fireBurst={sameAsPOSDone}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Typography sx={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                  Check each tender line and make sure declared amounts match POS totals.
                </Typography>
                {sameAsPOSDone ? (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                    <Check sx={{ fontSize: 13, color: '#4CAF50' }} />
                    <Typography sx={{ fontSize: 12, color: '#4CAF50', fontWeight: 600 }}>Declared same as POS</Typography>
                  </Box>
                ) : (
                  <Box onClick={(e) => { e.stopPropagation(); onSameAsPOS?.(); setSameAsPOSDone(true); toggleDone(0); }} sx={{
                    display: 'inline-flex', alignItems: 'center',
                    px: 1.5, py: 0.6, border: '1.5px solid rgba(0,0,0,0.08)', color: '#1A1A2E',
                    borderRadius: '100px', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', width: 'fit-content', bgcolor: '#fff',
                    '&:hover': { borderColor: 'rgba(0,0,0,0.2)', bgcolor: 'rgba(0,0,0,0.02)' },
                  }}>
                    Declare same as POS
                  </Box>
                )}
              </Box>
            </TaskBlock>

            <Divider />

            {/* Task 2 — Analyze discrepancies */}
            <TaskBlock
              number={2}
              title="Analyze discrepancies"
              subtitle={<Box component="img" src="/Images/AI.svg" alt="AI" sx={{ height: 14, display: 'block' }} />}
              done={done[1]}
              onToggleDone={() => toggleDone(1)}
              open={openTask === 1}
              onToggleOpen={() => setOpenTask(openTask === 1 ? -1 : 1)}
              delta={sundayDelta}
              loading={analyzing}
              bgGradient="radial-gradient(ellipse at 0% 0%, rgba(255,23,233,0.13) 0%, transparent 55%), radial-gradient(ellipse at 100% 0%, rgba(233,30,140,0.09) 0%, transparent 50%), radial-gradient(ellipse at 50% 120%, rgba(255,184,0,0.07) 0%, transparent 55%), #fff"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Typography sx={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>
                  Run an AI analysis to identify the root causes of payment discrepancies.
                </Typography>
                {!analyzed ? (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Box onClick={(e) => { e.stopPropagation(); onAnalyze(); setAnalyzing(true); setTimeout(() => { setAnalyzing(false); setAnalyzed(true); const d = [...done]; d[1] = true; setDone(d); }, 2800); }} sx={{
                      display: 'inline-flex', alignItems: 'center',
                      px: 1.5, py: 0.6,
                      bgcolor: '#FF17E9', color: '#fff',
                      borderRadius: '100px', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', width: 'fit-content',
                      '&:hover': { bgcolor: '#e010d4' },
                    }}>
                      Let sundayAI solve it
                    </Box>
                    <Box onClick={(e) => { e.stopPropagation(); onAnalyze(); setAnalyzing(true); setTimeout(() => { setAnalyzing(false); setAnalyzed(true); const d = [...done]; d[1] = true; setDone(d); }, 2800); }} sx={{
                      display: 'inline-flex', alignItems: 'center',
                      px: 1.5, py: 0.6,
                      bgcolor: '#1A1A2E', color: '#fff',
                      borderRadius: '100px', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', width: 'fit-content',
                      '&:hover': { bgcolor: '#2d2d4e' },
                    }}>
                      Run analysis
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Check sx={{ fontSize: 13, color: '#4CAF50' }} />
                    <Typography sx={{ fontSize: 12, color: '#4CAF50', fontWeight: 600 }}>Analysis complete</Typography>
                  </Box>
                )}
              </Box>
            </TaskBlock>

            {/* Sub-tasks 3,4,5 — appear after analysis */}
            {analyzed && SUB_TASKS.map((label, i) => (
              <React.Fragment key={i}>
                <Divider />
                <TaskBlock number={3 + i} title={label} done={subDone[i]} onToggleDone={() => toggleSub(i)} open={openTask === 10 + i} onToggleOpen={() => setOpenTask(openTask === 10 + i ? -1 : 10 + i)} delta={subDeltas[i]}>
                  <Typography sx={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                    Review and resolve this discrepancy before validating the day.
                  </Typography>
                </TaskBlock>
              </React.Fragment>
            ))}

            <Divider />

            {/* Last task — Add a comment */}
            <TaskBlock number={analyzed ? 6 : 3} title="Add a comment for your team" done={done[2]} onToggleDone={() => toggleDone(2)} open={openTask === 2} onToggleOpen={() => setOpenTask(openTask === 2 ? -1 : 2)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Typography sx={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                  Leave a note for your team about today's reconciliation.
                </Typography>
                <Box onClick={(e) => { e.stopPropagation(); goToComments(); }} sx={{
                  display: 'inline-flex', alignItems: 'center',
                  px: 1.5, py: 0.6, border: '1.5px solid rgba(0,0,0,0.15)', color: '#1A1A2E',
                  borderRadius: '100px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', width: 'fit-content',
                  '&:hover': { borderColor: '#1A1A2E', bgcolor: 'rgba(0,0,0,0.02)' },
                }}>
                  Add a comment
                </Box>
              </Box>
            </TaskBlock>
          </Box>

          {/* Validate button */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Box onClick={() => !validated && setValidated(true)} sx={{
              width: '100%', py: 1.25, borderRadius: '100px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              bgcolor: validated ? '#1A1A2E' : '#1A1A2E',
              color: '#fff',
              fontSize: 13, fontWeight: 700,
              cursor: validated ? 'default' : 'pointer',
              transition: 'all 0.2s',
              '&:hover': !validated ? { bgcolor: '#2d2d4e' } : {},
            }}>
              <Check sx={{ fontSize: 16 }} />
              {validated ? 'Day validated' : 'Validate the day'}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
