import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import BlogDetail from './pages/BlogDetail';
import LoadingPage from './components/LoadingPage';
import SmoothScroll from './components/SmoothScroll';
import { useTheme } from './hooks/useTheme';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAnimating } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <SmoothScroll>
            <div className="relative">
              {isAnimating && <div className="disk-transition-overlay" />}
              <LoadingPage />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Analytics />
            </div>
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => <AppContent />;

export default App;
