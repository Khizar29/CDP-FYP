import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Benefits from './components/AlumniBenefits';
import Alumni from './components/Graduates/AlumniPage';
import ProfilePage from './components/Graduates/ProfilePage';
import SignUp from './components/SignUp';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardHome from './components/admin/DashboardHome';
import AdminJobs from './components/admin/manage/Jobs/AdminJobs';
import AddJob from './components/admin/manage/Jobs/AddJob';
import AdminGraduates from './components/admin/manage/Graduates/AdminGraduate'; // Main page for managing graduates
import AddGraduate from './components/admin/manage/Graduates/AddGraduate'; // Component for importing graduates via Excel file
import ChangePassword from './components/ChangePassword';
import ContactUs from './components/ContactUs';
import UpdateGraduate from './components/admin/manage/Graduates/UpdateGraduate';
import ViewGraduate from './components/admin/manage/Graduates/ViewGraduate';


// User Layout Component
const UserLayout = ({ children, scrollToSection }) => (
  <div className="min-h-screen flex flex-col">
    <Header scrollToSection={scrollToSection} />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (section) => {
    if (section === 'about' && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout scrollToSection={scrollToSection}><Home aboutRef={aboutRef} contactRef={contactRef} /></UserLayout>} />
          <Route path="/about" element={<UserLayout scrollToSection={scrollToSection}><Home aboutRef={aboutRef} contactRef={contactRef} /></UserLayout>} />
          <Route path="/benefits" element={<UserLayout scrollToSection={scrollToSection}><Benefits /></UserLayout>} />
          <Route path="/alumni" element={<UserLayout scrollToSection={scrollToSection}><Alumni /></UserLayout>} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/signin" element={<UserLayout scrollToSection={scrollToSection}><SignIn /></UserLayout>} />
          <Route path="/signup" element={<UserLayout scrollToSection={scrollToSection}><SignUp /></UserLayout>} />
          <Route path="/contactUs" element={<UserLayout scrollToSection={scrollToSection}><ContactUs /></UserLayout>} />
          <Route path="/jobs" element={<UserLayout scrollToSection={scrollToSection}><JobList /></UserLayout>} />
          <Route path="/jobs/:jobId" element={<UserLayout scrollToSection={scrollToSection}><JobDetails /></UserLayout>} />
          <Route path="/reset-password/:id/:token" element={<UserLayout scrollToSection={scrollToSection}><ResetPassword /></UserLayout>} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="" element={<DashboardHome />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="jobs/manage" element={<AddJob />} />
            <Route path="jobs/manage/:id" element={<AddJob />} />

            {/* Graduate Routes */}
            <Route path="graduates" element={<AdminGraduates />} /> {/* Displays all graduates and options */}
            <Route path="graduates/import" element={<AddGraduate />} /> {/* Bulk import graduates via Excel */}
            <Route path="graduates/view/:nuId" element={<ViewGraduate />} /> {/* Add view route */}
            <Route path="graduates/edit/:nuId" element={<UpdateGraduate />} /> {/* Add edit route */}

          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
