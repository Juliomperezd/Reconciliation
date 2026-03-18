import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, ButtonBase, Tooltip } from '@mui/material';
import { useCurrentPath } from '../../contexts/PathContext';

const PATHS = [
  { id: 'path1', label: 'Dialog', full: 'Dialog model' },
  { id: 'path2', label: 'Sidebar', full: 'Sidebar' },
  { id: 'path3', label: 'Report', full: 'Report' },
];

export default function PathNavigator() {
  const navigate = useNavigate();
  const { currentPath, setCurrentPath } = useCurrentPath();
  const [hovered, setHovered] = useState(false);

  const handleSelect = (pathId) => {
    setCurrentPath(pathId);
    navigate(`/${pathId}`);
  };

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'fixed',
        top: '50%',
        left: 24,
        transform: 'translateY(-50%)',
        zIndex: 1400,
        bgcolor: '#1A1A2E',
        borderRadius: 2.5,
        px: 1.5,
        py: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        transition: 'opacity 0.2s',
        opacity: hovered ? 1 : 0.7,
      }}
    >
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          px: 0.5,
          mb: 0.5,
        }}
      >
        Paths
      </Typography>

      {PATHS.map((path) => {
        const isActive = currentPath === path.id;
        return (
          <Tooltip key={path.id} title={path.full} placement="right" arrow>
            <ButtonBase
              onClick={() => handleSelect(path.id)}
              sx={{
                borderRadius: 1.5,
                px: 1.5,
                py: 0.75,
                bgcolor: isActive ? '#E91E8C' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 12,
                letterSpacing: '0.04em',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isActive ? '#E91E8C' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                },
              }}
            >
              {path.label}
            </ButtonBase>
          </Tooltip>
        );
      })}
    </Box>
  );
}
