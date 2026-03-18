import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, ButtonBase } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useCurrentPath } from '../../contexts/PathContext';

const PATHS = [
  {
    id: 'path1',
    number: '01',
    label: 'Dialog model',
    description: 'Variante A del prototipo',
  },
  {
    id: 'path2',
    number: '02',
    label: 'Sidebar',
    description: 'Variante B del prototipo',
  },
  {
    id: 'path3',
    number: '03',
    label: 'Report',
    description: 'Variante C del prototipo',
  },
  {
    id: 'path4',
    number: '04',
    label: 'Tasks',
    description: 'Variante D del prototipo',
  },
];

export default function PathSelectorPage() {
  const navigate = useNavigate();
  const { setCurrentPath } = useCurrentPath();

  const handleSelect = (pathId) => {
    setCurrentPath(pathId);
    navigate(`/${pathId}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F5F5F7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 4,
      }}
    >
      {/* Logo */}
      <Typography
        sx={{
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: '-1px',
          color: '#1A1A2E',
          mb: 1,
        }}
      >
        AI reconciliation
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          color: '#888',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          mb: 8,
        }}
      >
        UX Exploration
      </Typography>

      {/* Cards */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 860,
        }}
      >
        {PATHS.map((path) => (
          <ButtonBase
            key={path.id}
            onClick={() => handleSelect(path.id)}
            sx={{
              flex: '1 1 220px',
              maxWidth: 260,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              bgcolor: '#fff',
              borderRadius: 3,
              border: '1.5px solid #E8E8EC',
              p: 4,
              gap: 2,
              transition: 'all 0.18s ease',
              '&:hover': {
                borderColor: '#1A1A2E',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 40,
                fontWeight: 900,
                lineHeight: 1,
                color: '#E8E8EC',
                letterSpacing: '-2px',
              }}
            >
              {path.number}
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>
              {path.label}
            </Typography>
            <Box
              sx={{
                mt: 'auto',
                pt: 2,
                width: '100%',
                borderTop: '1px solid #F0F0F0',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ArrowForward sx={{ fontSize: 14, color: '#bbb' }} />
              <Typography sx={{ fontSize: 11, color: '#bbb', letterSpacing: '0.08em' }}>
                ABRIR
              </Typography>
            </Box>
          </ButtonBase>
        ))}
      </Box>

      <Typography sx={{ fontSize: 12, color: '#ccc', mt: 8 }}>
        Prototipo interno · No para distribución
      </Typography>
    </Box>
  );
}
