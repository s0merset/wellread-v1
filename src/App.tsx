import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { LibraryProvider } from './context/LibraryContext';

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Lists from "./pages/Lists";
import Tracker from "./pages/Tracker";

// --- NEWLY ADDED PAGES ---
import LibraryView from "./components/lists/LibraryView";
import StatsPage from "./components/lists/StatsPage";
import ChallengePage from "./components/lists/ChallengePage";

const queryClient = new QueryClient();

// 1. Protected Route Wrapper Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <span className="material-symbols-outlined animate-spin text-primary text-4xl">slow_motion_video</span>
    </div>
  );

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// 2. Auth Listener Component
const AuthManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        if (window.location.pathname === '/auth') {
          navigate('/', { replace: true });
        }
      }
      
      if (event === 'SIGNED_OUT') {
        navigate('/auth', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
   <LibraryProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthManager />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* TRACKER SUB-ROUTES */}
          <Route path="/all-books" element={
            <ProtectedRoute>
              <LibraryView filter="all" />
            </ProtectedRoute>
          } />

          <Route path="/read" element={
            <ProtectedRoute>
              <LibraryView filter="finished" />
            </ProtectedRoute>
          } />

          <Route path="/currently-reading" element={
            <ProtectedRoute>
              <LibraryView filter="reading" />
            </ProtectedRoute>
          } />

          {/* INSIGHTS SUB-ROUTES */}
          <Route path="/stats" element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          } />

          <Route path="/challenge" element={
            <ProtectedRoute>
              <ChallengePage />
            </ProtectedRoute>
          } />

          {/* EXISTING PROTECTED ROUTES */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          
          <Route path="/lists" element={
            <ProtectedRoute>
              <Lists />
            </ProtectedRoute>
          } />

          <Route path="/tracker" element={
            <ProtectedRoute>
              <Tracker />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LibraryProvider>
  </QueryClientProvider>
);

export default App;
