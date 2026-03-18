import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, IconButton, Box, Chip,
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';

// ── Emoji field ───────────────────────────────────────────────────────────────
function EmojiField({ value, onChange }) {
  const inputRef = useRef(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box
        onClick={() => inputRef.current?.focus()}
        sx={{
          width: 64, height: 64,
          bgcolor: '#F5F5F7',
          borderRadius: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
          '&:hover .edit-overlay': { opacity: 1 },
        }}
      >
        <Typography sx={{ fontSize: 28, lineHeight: 1 }}>{value}</Typography>
        <Box
          className="edit-overlay"
          sx={{
            position: 'absolute', inset: 0, borderRadius: 2,
            bgcolor: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity 0.15s',
          }}
        >
          <Edit sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
      </Box>

      {/* Hidden but accessible input for emoji keyboard */}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          const val = [...e.target.value].slice(-2).join(''); // keep last emoji
          if (val) onChange(val);
        }}
        style={{
          position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none',
        }}
      />
      <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center', lineHeight: 1.3 }}>
        Click to<br />change
      </Typography>
    </Box>
  );
}

// ── Chip tag input ────────────────────────────────────────────────────────────
function ChipInput({ values, onChange, placeholder }) {
  const [inputVal, setInputVal] = useState('');

  const add = () => {
    const v = inputVal.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInputVal('');
  };

  const remove = (v) => onChange(values.filter((x) => x !== v));

  return (
    <Box
      sx={{
        display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center',
        border: '1px solid rgba(0,0,0,0.23)', borderRadius: 1, px: 1.5, py: 1,
        minHeight: 42,
        '&:focus-within': { borderColor: 'primary.main', borderWidth: 2, m: '-1px' },
      }}
    >
      {values.map((v) => (
        <Chip
          key={v}
          label={v}
          size="small"
          onDelete={() => remove(v)}
          sx={{ fontFamily: 'monospace', fontSize: 11, bgcolor: '#F5F5F7', height: 24 }}
        />
      ))}
      <input
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          if (e.key === 'Backspace' && !inputVal && values.length) remove(values[values.length - 1]);
        }}
        onBlur={add}
        placeholder={values.length === 0 ? placeholder : ''}
        style={{
          border: 'none', outline: 'none', fontSize: 12, fontFamily: 'monospace',
          background: 'transparent', minWidth: 120, flexGrow: 1,
        }}
      />
    </Box>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function AddTenderModal({ open, onClose, onSubmit, initialValues = null }) {
  const isEditing = !!initialValues;

  const [name, setName]         = useState('');
  const [emoji, setEmoji]       = useState('💼');
  const [posIds, setPosIds]     = useState([]);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialValues?.name ?? '');
      setEmoji(initialValues?.icon ?? '💼');
      setPosIds(initialValues?.posId ? [initialValues.posId] : []);
      setNameError('');
    }
  }, [open, initialValues]);

  const handleSubmit = () => {
    if (!name.trim()) { setNameError('Tender name is required'); return; }
    onSubmit({ name: name.trim(), icon: emoji, posId: posIds[0] ?? '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {isEditing ? 'Edit tender' : 'Add tender line'}
        </Typography>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>

          {/* Emoji — top, then name below */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <EmojiField value={emoji} onChange={setEmoji} />
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>Tender name</Typography>
              <TextField
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                error={!!nameError}
                helperText={nameError}
                fullWidth size="small"
                placeholder="e.g. American Express"
              />
            </Box>
          </Box>

          {/* POS Tender IDs — chip input */}
          <Box>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 500, mb: 0.75 }}>
              POS Tender ID
            </Typography>
            <ChipInput
              values={posIds}
              onChange={setPosIds}
              placeholder="Type and press Enter to add…"
            />
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{
            bgcolor: '#1A1A2E', color: '#fff', borderRadius: 100,
            py: 1.25, fontSize: 14, fontWeight: 600,
            '&:hover': { bgcolor: '#2d2d4e' },
          }}
        >
          {isEditing ? 'Save changes' : 'Add tender'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
