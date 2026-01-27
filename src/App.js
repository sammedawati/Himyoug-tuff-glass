import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/public/MainLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ProductsPage from './pages/public/ProductsPage';
import ContactPage from './pages/public/ContactPage';
import QuotePage from './pages/public/QuotePage';
import FacilitiesPage from './pages/public/FacilitiesPage';
import EventsPage from './pages/public/EventsPage';
import GalleryPage from './pages/public/GalleryPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { initializeFirebaseData } from './FirebaseInitializer';

// Simple Protected Route wrapper
const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; 
    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

// Module-level flag to ensure check runs only once per session load
let hasHandledReload = false;

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasHandledReload) {
      hasHandledReload = true;
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
        navigate('/', { replace: true });
      }
    }
  }, [navigate]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:category" element={<ProductsPage />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="quote" element={<QuotePage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin">
            <Route path="login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<AdminDashboard />} />
            </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    initializeFirebaseData();
  }, []);

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
