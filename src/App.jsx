import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import theme from './theme';
import { PathProvider, useCurrentPath } from './contexts/PathContext';
import AppLayout from './components/layout/AppLayout';
import DailyReportsPage from './components/daily-reports/DailyReportsPage';
import DailyReportsPageSidebar from './components/daily-reports/DailyReportsPageSidebar';
import OperationsPage from './components/operations/OperationsPage';
import TenderDetailPage from './components/daily-reports/TenderDetailPage';
import GalleryPage from './components/gallery/GalleryPage';
import PathSelectorPage from './components/paths/PathSelectorPage';

// Wrapper para cada path: actualiza el contexto al entrar
function PathEntry({ pathId }) {
  const { setCurrentPath } = useCurrentPath();
  useEffect(() => { setCurrentPath(pathId); }, [pathId]);
  if (pathId === 'path2') return <DailyReportsPageSidebar />;
  return <DailyReportsPage />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <PathProvider>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<PathSelectorPage />} />

            {/* Gallery standalone */}
            <Route path="/gallery" element={<GalleryPage />} />

            {/* Paths */}
            {['path1', 'path2', 'path3'].map((pathId) => (
              <Route
                key={pathId}
                path={`/${pathId}/*`}
                element={
                  <AppLayout>
                    <Routes>
                      <Route index element={<PathEntry pathId={pathId} />} />
                      <Route path="operations" element={<OperationsPage />} />
                      <Route path="operations/*" element={<OperationsPage />} />
                      <Route path="tender/:id" element={<TenderDetailPage />} />
                    </Routes>
                  </AppLayout>
                }
              />
            ))}
          </Routes>
        </PathProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
