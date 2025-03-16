// src/App.js
import { Toaster } from 'react-hot-toast';
import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import About from './components/About'; 
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Announcements from './components/Announcements';
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
import EditGraduateProfile from './components/Graduates/EditProfile';
import NewsFeed from './components/Newsfeeds/NewsFeed';
import NewsDetail from './components/Newsfeeds/NewsDetail';
import PaginatedNewsFeed from './components/Newsfeeds/PaginatedNewfeed';
import AdminNewsfeed from './components/admin/manage/Newsfeeds/AdminNewsfeed';
import AddNews from './components/admin/manage/Newsfeeds/AddNews';
import ViewNews from './components/admin/manage/Newsfeeds/ViewNews';
import EditNews from './components/admin/manage/Newsfeeds/EditNews';
import AdminTestimonials from './components/admin/manage/Testimonials/AdminTestimonials';
import AddEditTestimonial from './components/admin/manage/Testimonials/Add-EditTestimonials';
import RecruiterManageJobs from './components/Recruiter/PostedJobs';
import RecruiterLayout from './components/Recruiter/RecruiterLayout';
import AddJobRecruiter from './components/Recruiter/AddJobRecruiter';
import AdminRecruiters from './components/admin/manage/Recruiters/AdminRecruiters';
import FacultyLayout from './components/Faculty/FacultyLayout';
import FacultyManageAnnouncements from './components/Faculty/PostedAnnouncements';
import AddAnnouncement from './components/Faculty/AddAnnouncement';
import EditAnnouncement from './components/Faculty/EditAnnouncement';
import AdminFaculty from './components/admin/manage/Faculty/AdminFaculty';
import FacultyNewsfeed from './components/Faculty/FacultyNewsfeed';
import FacultyAddNews from './components/Faculty/FacultyAddNews';
import FacultyEditNews from './components/Faculty/FacultyEditNews';
import FacultyViewNews from './components/Faculty/FacultyViewNews';



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
      <Toaster /> 
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout><Home /></UserLayout>} />
          <Route path="/about" element={<UserLayout><section className="min-h-screen py-10 flex flex-col items-center justify-center bg-cover bg-center relative space-y-10" style={{ backgroundImage: `url(${require('./Images/bg-5.jpg')})` }}><About /></section></UserLayout>} />
          <Route path="/announcements" element={<UserLayout><Announcements /></UserLayout>} />
          <Route path="/alumni" element={<UserLayout><Alumni /></UserLayout>} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/edit-profile/:nuId" element={<EditGraduateProfile />} />
          <Route path="/signin" element={<UserLayout><SignIn /></UserLayout>} />
          <Route path="/signup" element={<UserLayout><SignUp /></UserLayout>} />
          <Route path="/contactUs" element={<UserLayout><section className="min-h-screen py-10 flex flex-col items-center justify-center bg-cover bg-center relative space-y-10" style={{ backgroundImage: `url(${require('./Images/bg-6.jpg')})` }}><ContactUs /></section></UserLayout>} />
          <Route path="/jobs" element={<UserLayout><JobList /></UserLayout>} />
          <Route path="/jobs/:jobId" element={<UserLayout><JobDetails /></UserLayout>} />
          <Route path="/reset-password/:id/:token" element={<UserLayout><ResetPassword /></UserLayout>} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/news" element={<UserLayout><PaginatedNewsFeed /></UserLayout>} />
          <Route path="/news/:id" element={<UserLayout><NewsDetail /></UserLayout>} />

          {/* Admin Dashboard */}
          <Route path="/admin/*" element={
             <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Managing Jobs, Graduates, Newsfeed, Testimonials, Recruiters for Admins */}
            <Route path="" element={<DashboardHome />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="jobs/manage" element={<AddJob />} />
            <Route path="jobs/manage/:id" element={<AddJob />} />
            <Route path="graduates" element={<AdminGraduates />} />
            <Route path="graduates/import" element={<AddGraduate />} />
            <Route path="graduates/view/:nuId" element={<ViewGraduate />} />
            <Route path="graduates/edit/:nuId" element={<UpdateGraduate />} />
            <Route path="newsfeeds" element={<AdminNewsfeed />} />
            <Route path="newsfeeds/add" element={<AddNews />} />
            <Route path="newsfeeds/view/:id" element={<ViewNews />} />
            <Route path="newsfeeds/edit/:id" element={<EditNews />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="testimonials/add" element={<AddEditTestimonial />} />
            <Route path="testimonials/edit/:id" element={<AddEditTestimonial />} />
            <Route path="recruiters" element={<AdminRecruiters />} />
            <Route path="faculty" element={<AdminFaculty />} />
          </Route>

          {/* Recruiter Dashboard */}
          <Route path="/recruiter/*" element={
             <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterLayout/>
            </ProtectedRoute>
          }>
            <Route path="" element= {<RecruiterManageJobs/>}/>
            <Route path="addjob" element= {<AddJobRecruiter/>}/>
          </Route>

          {/* Faculty Dashboard */}
          <Route path="/faculty/*" element={
             <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyLayout/>
            </ProtectedRoute>
          }>
            <Route path="announcements" element= {<FacultyManageAnnouncements/>}/>
            <Route path="announcements/add" element= {<AddAnnouncement/>}/>
            <Route path="announcements/edit/:announcementId" element={<EditAnnouncement />} />
            <Route path="newsfeed" element={<FacultyNewsfeed />} />
            <Route path="newsfeed/add" element={<FacultyAddNews />} />
            <Route path="newsfeed/edit/:id" element={<FacultyEditNews />} />
            <Route path="newsfeed/view/:id" element={<FacultyViewNews/>} />



          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;