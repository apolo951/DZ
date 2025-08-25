import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ExtractionStatusDebug } from '@/components/debug/ExtractionStatusDebug';
import { AIAutoFillGlobalManager } from '@/components/ai/AIAutoFillGlobalManager';
import { setupGlobalErrorHandling } from '@/utils/globalErrorHandler';
import Index from '@/pages/Index';
import { ModalProvider, ModalRenderer } from '@/components/modals/unified';

// Initialiser la gestion d'erreurs globale
setupGlobalErrorHandling();

const queryClient = new QueryClient();

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path=":section" element={<Index />} />
        <Route path=":section/*" element={<Index />} />
        <Route path="*" element={<Index />} />
      </Routes>
      <AIAutoFillGlobalManager />
      <ModalRenderer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ModalProvider>
            <AppContent />
          </ModalProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;