import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const Index = lazy(() => import('./pages/Index.tsx'));
const BuilderPage = lazy(() => import('./pages/BuilderPage.tsx'));
const MissionDemo = lazy(() => import('./pages/MissionDemo.tsx'));
const WorldMap = lazy(() => import('./pages/WorldMap.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Suspense fallback={<div className="min-h-screen bg-[#05090f]" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/mission-demo" element={<MissionDemo />} />
            <Route path="/world-map" element={<WorldMap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
