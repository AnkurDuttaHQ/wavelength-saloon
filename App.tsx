import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ServicesIndexPage from './components/ServicesIndexPage';
import HairServicesPage from './components/HairServicesPage';
import BeautyServicesPage from './components/BeautyServicesPage';
import BridalMakeupPage from './components/BridalMakeupPage';
import GalleryPage from './components/GalleryPage';
import ReviewsPage from './components/ReviewsPage';
import ContactPage from './components/ContactPage';
import AppointmentPage from './components/AppointmentPage';
import Footer from './components/Footer';
import FloatingWA from './components/FloatingWA';
import CustomCursor from './components/CustomCursor';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen font-sans bg-[#FAF8F5] text-[#0F0F0F] selection:bg-[#D4AF37]/35 selection:text-black flex flex-col justify-between">
        
        {/* Sticky Header Navigation bar */}
        <Header />

        {/* Dynamic Multi-Page Router Body */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesIndexPage />} />
            <Route path="/hair-services" element={<HairServicesPage />} />
            <Route path="/beauty-services" element={<BeautyServicesPage />} />
            <Route path="/bridal-makeup" element={<BridalMakeupPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            {/* Fallback client-side route redirects to Home safely */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Universal Footer */}
        <Footer />

        {/* WhatsApp concierge widget */}
        <FloatingWA />

        {/* Luxury Gold Custom Cursor */}
        <CustomCursor />

      </div>
    </Router>
  );
}
