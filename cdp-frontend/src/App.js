// src/App.js

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
import AdminGraduates from './components/admin/manage/Graduates/AdminGraduate';
import AddGraduate from './components/admin/manage/Graduates/AddGraduate';
import ChangePassword from './components/ChangePassword';
import ContactUs from './components/ContactUs';
import UpdateGraduate from './components/admin/manage/Graduates/UpdateGraduate';
import ViewGraduate from './components/admin/manage/Graduates/ViewGraduate';
import NewsFeed from './components/Newsfeeds/Newsfeed';
import NewsDetail from './components/Newsfeeds/NewsDetail';
import PaginatedNewsFeed from './components/Newsfeeds/PaginatedNewfeed';
import AdminNewsfeed from './components/admin/manage/Newsfeeds/AdminNewsfeed';
import AddNews from './components/admin/manage/Newsfeeds/AddNews';
import ViewNews from './components/admin/manage/Newsfeeds/ViewNews';
import EditNews from './components/admin/manage/Newsfeeds/EditNews';


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
          <Route path="/news" element={<UserLayout><PaginatedNewsFeed /></UserLayout>} />
          {/* <Route path="/news" element={<UserLayout scrollToSection={scrollToSection}><NewsFeed /></UserLayout>} /> News Feed Route */}
          <Route path="/news/:id" element={<UserLayout><NewsDetail /></UserLayout>} />

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
            <Route path="graduates" element={<AdminGraduates />} />
            <Route path="graduates/import" element={<AddGraduate />} />
            <Route path="graduates/view/:nuId" element={<ViewGraduate />} />
            <Route path="graduates/edit/:nuId" element={<UpdateGraduate />} />

            {/* Newsfeed Routes */}
            <Route path="newsfeeds" element={<AdminNewsfeed />} />
            <Route path="newsfeeds/add" element={<AddNews />} />
            <Route path="newsfeeds/view/:id" element={<ViewNews />} />
            <Route path="newsfeeds/edit/:id" element={<EditNews />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
