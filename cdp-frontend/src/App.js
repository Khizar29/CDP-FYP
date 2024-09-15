import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Benefits from './components/AlumniBenefits';
import Alumni from './components/AlumniPage';
import Contact from './components/ContactUs';
import SignUp from './components/SignUp';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardHome from './components/admin/DashboardHome';
import AdminJobs from './components/admin/AdminJobs';
import AddJob from './components/admin/manage/Jobs/AddJob';
import ChangePassword from './components/ChangePassword';

// User Layout Component
const UserLayout = ({ children, scrollToSection }) => (
  <>
    <Header scrollToSection={scrollToSection} />
    {children}
    <Footer />
  </>
);

function App() {
  const aboutRef = useRef(null);

  const scrollToSection = (section) => {
    if (section === 'about' && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout scrollToSection={scrollToSection}><Home aboutRef={aboutRef} /></UserLayout>} />
          <Route path="/about" element={<UserLayout scrollToSection={scrollToSection}><Home aboutRef={aboutRef} /></UserLayout>} />
          <Route path="/benefits" element={<UserLayout scrollToSection={scrollToSection}><Benefits /></UserLayout>} />
          <Route path="/alumni" element={<UserLayout scrollToSection={scrollToSection}><Alumni /></UserLayout>} />
          <Route path="/signin" element={<UserLayout scrollToSection={scrollToSection}><SignIn /></UserLayout>} />
          <Route path="/signup" element={<UserLayout scrollToSection={scrollToSection}><SignUp /></UserLayout>} />
          <Route path="/contact" element={<UserLayout scrollToSection={scrollToSection}><Contact /></UserLayout>} />
          <Route path="/jobs" element={<UserLayout scrollToSection={scrollToSection}><JobList /></UserLayout>} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/jobs/:jobId" element={<UserLayout scrollToSection={scrollToSection}><JobDetails /></UserLayout>} />
          <Route path="/reset-password/:id/:token" element={<UserLayout scrollToSection={scrollToSection}><ResetPassword /></UserLayout>} />

         
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="" element={<DashboardHome />} />
            <Route path="jobs" element={<AdminJobs/>} />
            <Route path="jobs/manage" element={<AddJob />} />
            <Route path="jobs/manage/:id" element={<AddJob />} />

          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
