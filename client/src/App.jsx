import { useEffect } from 'react';
import { startSmoothScroll } from './lib/scroll';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import VideoRoom from './pages/VideoRoom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import InterviewSession from './pages/InterviewSession';
import QuizInterview from './pages/QuizInterview';
import PremiumRewards from './pages/PremiumRewards';
import InterviewSetup from './pages/InterviewSetup';
import Resume from './pages/Resume';
import Analytics from './pages/Analytics';
import CandidateDetail from './pages/CandidateDetail';
import Resources from './pages/Resources';
import HRTableSmoke from './pages/hr/HRTable.smoke';
import AdminDashboard from './pages/admin/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import PaymentComplete from './pages/PaymentComplete';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';

function AnimatedRoutes() {
  const loc = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={loc.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={loc}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/premium" element={<PremiumRewards />} />
          <Route path="/interview" element={<InterviewSession />} />
          <Route path="/interview-setup" element={<InterviewSetup />} />
          <Route path="/quiz" element={<QuizInterview />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/candidate/:id" element={<CandidateDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/payment/complete" element={<PaymentComplete />} />
          <Route path="/room/:roomId" element={<VideoRoom />} />
          {import.meta.env.DEV && <Route path="/hr/smoke" element={<HRTableSmoke />} />}
        </Routes>
      </Motion.div>
    </AnimatePresence>
  );
}

function Shell() {
  const loc = useLocation();
  const bare = loc.pathname === '/interview' || loc.pathname.startsWith('/room');
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      {!bare && <Footer />}
      {!bare && <MobileNav />}
    </div>
  );
}

function App() {
  useEffect(() => startSmoothScroll(), []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


