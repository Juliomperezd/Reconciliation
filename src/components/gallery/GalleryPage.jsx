import React, { useState } from 'react';
import {
  Box, Typography, Divider, Paper, Chip, Stack,
} from '@mui/material';
import { days, tenders, operations, initialComments, sundayAIGaps, helpCards } from '../../data/dummy';

// Components to showcase
import DayCard from '../daily-reports/DayCard';
import DateStrip from '../daily-reports/DateStrip';
import DeltaCell from '../daily-reports/DeltaCell';
import TenderRow from '../daily-reports/TenderRow';
import TenderTable from '../daily-reports/TenderTable';
import DiscrepancyAlert from '../daily-reports/DiscrepancyAlert';
import FloatingActionBar from '../layout/FloatingActionBar';
import OperationRow from '../operations/OperationRow';
import OperationsTable from '../operations/OperationsTable';
import DatePickerModal from '../modals/DatePickerModal';
import AddTenderModal from '../modals/AddTenderModal';
import SundayAIModal from '../modals/SundayAIModal';
import CommentsPanel from '../panels/CommentsPanel';
import HelpPanel from '../panels/HelpPanel';

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, description, children, bg }) {
  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 15, mb: 0.25 }}>{title}</Typography>
        {description && (
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{description}</Typography>
        )}
      </Box>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          bgcolor: bg ?? '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
const SECTIONS = [
  'DayCard', 'DateStrip', 'DeltaCell', 'TenderRow', 'TenderTable',
  'DiscrepancyAlert', 'FloatingActionBar',
  'OperationRow', 'OperationsTable',
  'DatePickerModal', 'AddTenderModal', 'SundayAIModal',
  'CommentsPanel', 'HelpPanel',
];

export default function GalleryPage() {
  const [selectedDay, setSelectedDay] = useState('2026-03-10');
  const [localTenders, setLocalTenders] = useState(tenders);
  const [comments, setComments] = useState(initialComments);

  // modal/panel open states
  const [datePicker, setDatePicker] = useState(false);
  const [addTender, setAddTender] = useState(false);
  const [sundayAI, setSundayAI] = useState(false);
  const [commentsPanel, setCommentsPanel] = useState(false);
  const [helpPanel, setHelpPanel] = useState(false);

  const handleUpdateTender = (id, val) => {
    setLocalTenders((prev) =>
      prev.map((t) => t.id === id ? { ...t, totalDeclared: val } : t)
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F5F7' }}>
      {/* Sticky sidebar nav */}
      <Box
        sx={{
          width: 200,
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          bgcolor: '#1A1A2E',
          p: 2,
        }}
      >
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
          Components
        </Typography>
        {SECTIONS.map((s) => (
          <Box
            key={s}
            component="a"
            href={`#${s}`}
            sx={{
              display: 'block',
              color: 'rgba(255,255,255,0.65)',
              fontSize: 13,
              py: 0.6,
              px: 1,
              borderRadius: 1,
              textDecoration: 'none',
              '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            {s}
          </Box>
        ))}
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 4, maxWidth: 900 }}>
        <Box sx={{ mb: 5 }}>
          <Chip label="Component Gallery" color="primary" size="small" sx={{ mb: 1.5 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Daily Reports UI</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            {SECTIONS.length} components · click the interactive ones to test them live
          </Typography>
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* ── DayCard ── */}
        <Box id="DayCard">
          <Section title="DayCard" description="Represents a single day in the date strip. Three status variants.">
            <DayCard day={days[9]} selected={false} onClick={() => {}} />
            <DayCard day={days[9]} selected={true} onClick={() => {}} />
            <DayCard day={days[2]} selected={false} onClick={() => {}} />
            <DayCard day={days[0]} selected={false} onClick={() => {}} />
          </Section>
        </Box>

        {/* ── DateStrip ── */}
        <Box id="DateStrip">
          <Section title="DateStrip" description="Horizontal scrollable strip. Click 'See all' or a day card.">
            <Box sx={{ width: '100%' }}>
              <DateStrip
                days={days}
                selectedDayId={selectedDay}
                onSelectDay={setSelectedDay}
                onSeeAll={() => setDatePicker(true)}
              />
            </Box>
          </Section>
        </Box>

        {/* ── DeltaCell ── */}
        <Box id="DeltaCell">
          <Section title="DeltaCell" description="Shows a warning chip when delta ≠ 0, a green check when balanced.">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>delta = 0</Typography>
                <DeltaCell delta={0} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>delta = +12.50</Typography>
                <DeltaCell delta={12.50} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>delta = -30.00</Typography>
                <DeltaCell delta={-30.00} />
              </Box>
            </Box>
          </Section>
        </Box>

        {/* ── TenderRow ── */}
        <Box id="TenderRow">
          <Section title="TenderRow" description="Click the 'Total Declared' amount to edit it inline.">
            <Box sx={{ width: '100%', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8F8FA' }}>
                    {['Tender', 'Total in POS', 'Total Declared', 'Delta'].map((h) => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Tender' ? 'left' : 'right', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {h === 'Delta' ? <span style={{ display: 'block', textAlign: 'center' }}>{h}</span> : h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {localTenders.slice(0, 3).map((t) => (
                    <TenderRow key={t.id} tender={t} onUpdate={handleUpdateTender} />
                  ))}
                </tbody>
              </table>
            </Box>
          </Section>
        </Box>

        {/* ── TenderTable ── */}
        <Box id="TenderTable">
          <Section title="TenderTable" description="Full table with all tenders + 'Add tender line' button at the bottom.">
            <Box sx={{ width: '100%' }}>
              <TenderTable
                tenders={localTenders}
                onUpdateTender={handleUpdateTender}
                onAddTender={() => setAddTender(true)}
              />
            </Box>
          </Section>
        </Box>

        {/* ── DiscrepancyAlert ── */}
        <Box id="DiscrepancyAlert">
          <Section title="DiscrepancyAlert" description="Shown when at least one tender has a non-zero delta.">
            <Box sx={{ width: '100%' }}>
              <DiscrepancyAlert
                onSolveAI={() => setSundayAI(true)}
                onSeeOps={() => {}}
              />
            </Box>
          </Section>
        </Box>

        {/* ── FloatingActionBar ── */}
        <Box id="FloatingActionBar">
          <Section title="FloatingActionBar" description="Inline preview (normally fixed at bottom of page). Three states for Validate.">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              {[
                { label: 'Default', props: { validated: false, validateDisabled: false } },
                { label: 'Validated', props: { validated: true, validateDisabled: false } },
                { label: 'Disabled (Operations)', props: { validated: false, validateDisabled: true } },
              ].map(({ label, props }) => (
                <Box key={label}>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 1 }}>{label}</Typography>
                  <Paper elevation={2} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 3 }}>
                    <FloatingActionBar
                      commentCount={comments.length}
                      onHelp={() => setHelpPanel(true)}
                      onComments={() => setCommentsPanel(true)}
                      onValidate={() => {}}
                      {...props}
                      // override fixed positioning for gallery
                      sx={{ position: 'static', transform: 'none', boxShadow: 'none' }}
                    />
                  </Paper>
                </Box>
              ))}
            </Box>
          </Section>
        </Box>

        {/* ── OperationRow ── */}
        <Box id="OperationRow">
          <Section title="OperationRow" description="Single row. Click the ⋮ menu for actions.">
            <Box sx={{ width: '100%', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: '#F8F8FA' }}>
                    {['Date / Source / Server', 'Payment', 'Status', 'Actions'].map((h) => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Actions' ? 'center' : 'left', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {operations.slice(0, 3).map((op) => (
                    <OperationRow key={op.id} operation={op} />
                  ))}
                </tbody>
              </table>
            </Box>
          </Section>
        </Box>

        {/* ── OperationsTable ── */}
        <Box id="OperationsTable">
          <Section title="OperationsTable" description="Full table with toolbar and all 8 mock operations.">
            <Box sx={{ width: '100%' }}>
              <OperationsTable operations={operations} />
            </Box>
          </Section>
        </Box>

        {/* ── Modals ── */}
        <Box id="DatePickerModal">
          <Section title="DatePickerModal" description="Click to open the dialog.">
            <Box
              onClick={() => setDatePicker(true)}
              sx={{ px: 3, py: 2, bgcolor: '#1A1A2E', color: '#fff', borderRadius: 2, cursor: 'pointer', fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: '#2d2d4e' } }}
            >
              Open DatePickerModal →
            </Box>
          </Section>
        </Box>

        <Box id="AddTenderModal">
          <Section title="AddTenderModal" description="Form dialog with name validation. Submit adds a row to TenderTable above.">
            <Box
              onClick={() => setAddTender(true)}
              sx={{ px: 3, py: 2, bgcolor: '#1A1A2E', color: '#fff', borderRadius: 2, cursor: 'pointer', fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: '#2d2d4e' } }}
            >
              Open AddTenderModal →
            </Box>
          </Section>
        </Box>

        <Box id="SundayAIModal">
          <Section title="SundayAIModal" description="Loading stepper → accordion results → solve → Snackbar with Undo.">
            <Box
              onClick={() => setSundayAI(true)}
              sx={{ px: 3, py: 2, background: 'linear-gradient(135deg, #E91E8C, #9C27B0)', color: '#fff', borderRadius: 2, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
            >
              Open SundayAIModal →
            </Box>
          </Section>
        </Box>

        {/* ── Panels ── */}
        <Box id="CommentsPanel">
          <Section title="CommentsPanel" description="Right-side drawer. Send a message to append it to the list.">
            <Box
              onClick={() => setCommentsPanel(true)}
              sx={{ px: 3, py: 2, bgcolor: '#1A1A2E', color: '#fff', borderRadius: 2, cursor: 'pointer', fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: '#2d2d4e' } }}
            >
              Open CommentsPanel →  ({comments.length} comments)
            </Box>
          </Section>
        </Box>

        <Box id="HelpPanel">
          <Section title="HelpPanel" description="Right-side drawer with pink background, help cards, and chat input.">
            <Box
              onClick={() => setHelpPanel(true)}
              sx={{ px: 3, py: 2, bgcolor: '#E91E8C', color: '#fff', borderRadius: 2, cursor: 'pointer', fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: '#c2185b' } }}
            >
              Open HelpPanel →
            </Box>
          </Section>
        </Box>

        <Box sx={{ height: 80 }} />
      </Box>

      {/* All modals/panels wired up */}
      <DatePickerModal
        open={datePicker}
        onClose={() => setDatePicker(false)}
        days={days}
        selectedDayId={selectedDay}
        onSelectDay={(id) => { setSelectedDay(id); setDatePicker(false); }}
      />
      <AddTenderModal
        open={addTender}
        onClose={() => setAddTender(false)}
        onSubmit={(name, pos) => {
          setLocalTenders((prev) => [...prev, { id: `g-${Date.now()}`, name, icon: '💼', totalInToast: 0, totalDeclared: 0, delta: 0, status: 'ok' }]);
        }}
      />
      <SundayAIModal
        open={sundayAI}
        onClose={() => setSundayAI(false)}
        onSolved={(c) => setComments((prev) => [...prev, c])}
        onUndo={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
      />
      <CommentsPanel
        open={commentsPanel}
        onClose={() => setCommentsPanel(false)}
        comments={comments}
        onSend={(msg) => setComments((prev) => [...prev, {
          id: `c-${Date.now()}`,
          author: { name: 'Sarah Miller', initials: 'SM', color: '#E91E8C', role: 'Manager' },
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          message: msg,
          isAI: false,
        }])}
      />
      <HelpPanel open={helpPanel} onClose={() => setHelpPanel(false)} />
    </Box>
  );
}
