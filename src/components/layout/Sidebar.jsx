import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Typography, Avatar, Divider, IconButton,
} from '@mui/material';
import {
  BarChart, ExpandMore, Settings,
  HelpOutline, ChevronRight, SpaceDashboard,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentPath } from '../../contexts/PathContext';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Daily Reports', icon: <BarChart />, pathKey: 'daily-reports' },
];

const BOTTOM_ITEMS = [
  { label: 'Guides & QA', icon: <HelpOutline />, path: '/guides' },
  { label: 'Settings', icon: <Settings />, path: '/settings' },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPath } = useCurrentPath();
  const [opsOpen, setOpsOpen] = useState(true);

  // Resolve nav item destination based on current path context
  const resolveNavPath = (item) => {
    if (item.pathKey === 'daily-reports') return `/${currentPath}`;
    return item.path;
  };

  const isActive = (item) => {
    const resolved = resolveNavPath(item);
    return location.pathname === resolved || location.pathname.startsWith(resolved + '/tender');
  };

  const NavItem = ({ item, indent = false }) => {
    const active = isActive(item);
    const hasChildren = !!item.children;

    return (
      <>
        <ListItemButton
          onClick={() => {
            if (hasChildren) setOpsOpen((o) => !o);
            else { navigate(resolveNavPath(item)); onMobileClose?.(); }
          }}
          sx={{
            mx: 1,
            mb: 0.25,
            pl: indent ? 4 : 1.5,
            pr: 1.5,
            py: 1,
            borderRadius: 2,
            bgcolor: active ? 'rgba(233,30,140,0.08)' : 'transparent',
            '&:hover': { bgcolor: active ? 'rgba(233,30,140,0.12)' : 'rgba(0,0,0,0.04)' },
          }}
        >
          {/* Expand chevron for parent items */}
          {hasChildren && (
            <Box sx={{ mr: 0.5, color: '#aaa', display: 'flex', fontSize: 16 }}>
              {opsOpen ? <ExpandMore sx={{ fontSize: 18 }} /> : <ChevronRight sx={{ fontSize: 18 }} />}
            </Box>
          )}

          <ListItemIcon
            sx={{
              minWidth: 36,
              color: active ? 'primary.main' : '#999',
              '& svg': { fontSize: 20 },
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              color: active ? '#1A1A2E' : '#555',
            }}
          />
        </ListItemButton>

        {hasChildren && (
          <Collapse in={opsOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              {item.children.map((child) => (
                <NavItem key={child.label} item={child} indent />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff' }}>

      {/* Brand Header */}
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 40, height: 40, bgcolor: '#fdf6c3',
            color: '#b8970a', fontSize: 11, fontWeight: 800, letterSpacing: 0.5,
          }}
        >
          BOU
        </Avatar>
        <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#1A1A2E', flexGrow: 1 }}>
          Bouillon
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton size="small" sx={{ color: '#bbb' }}><ExpandMore sx={{ fontSize: 18 }} /></IconButton>
          <IconButton size="small" sx={{ color: '#bbb' }}><SpaceDashboard sx={{ fontSize: 18 }} /></IconButton>
        </Box>
      </Box>

      {/* Main Nav */}
      <List sx={{ px: 0, py: 1, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </List>

      {/* Bottom Nav */}
      <Divider sx={{ mx: 2, borderColor: 'rgba(0,0,0,0.06)' }} />
      <List sx={{ px: 0, py: 1 }}>
        {BOTTOM_ITEMS.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => { navigate(item.path); onMobileClose?.(); }}
            sx={{
              mx: 1, px: 1.5, py: 0.9, borderRadius: 2, mb: 0.25,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#bbb', '& svg': { fontSize: 20 } }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, color: '#aaa', fontWeight: 400 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mx: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

      {/* User Footer */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#E91E8C', fontSize: 13, fontWeight: 700 }}>
          SM
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', lineHeight: 1.3 }}>
            Sarah Miller
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#aaa' }}>manager</Typography>
        </Box>
        <IconButton size="small" sx={{ color: '#bbb' }}>
          <ExpandMore sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0,0,0,0.07)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
