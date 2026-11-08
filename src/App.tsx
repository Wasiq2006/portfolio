import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import LoadingPage from './components/LoadingPage';
import SmoothScroll from './components/SmoothScroll';
import ThemeProvider from './components/ThemeProvider';
import { useTheme } from './hooks/useTheme';

// Blog posts are a separate route, so their markdown renderer loads on demand.
const BlogDetail = lazy(() => import('./pages/BlogDetail'));

const AppContent = () => {
  const { isAnimating } = useTheme();

  return (
    <BrowserRouter>
      <SmoothScroll>
        <div className="relative">
          {isAnimating && <div className="disk-transition-overlay" />}
          <LoadingPage />
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Analytics />
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
