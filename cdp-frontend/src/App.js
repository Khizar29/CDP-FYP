// src/App.js
import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Corrected path
import Header from './components/Header';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Benefits from './components/AlumniBenefits';
import Alumni from './components/AlumniPage';
import Contact from './components/ContactUs';
import SignUp from './components/SignUp';

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
        <Header scrollToSection={scrollToSection} />
        <Routes>
          <Route path="/" element={<Home aboutRef={aboutRef} />} />
          <Route path="/about" element={<Home aboutRef={aboutRef} />} /> {/* Optional: separate About route */}
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;






// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { UserProvider } from './contexts/UserContext'; // Corrected path
// import Home from './components/Home';
// import SignIn from './components/SignIn';
// import SignUp from './components/SignUp';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import About from './components/About';

// import AlumniPage from './components/AlumniPage';

// function App() {
//   return (

//     <UserProvider>
//       <div className="flex flex-col min-h-screen">
//       <Router>
//         <Header />
//         <div className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/alumni" element={<AlumniPage />} />
//           </Routes>
//         </div>
//         <Footer />
//       </Router>
//     </div>
//     </UserProvider>
    
//   );
// }

// export default App;
