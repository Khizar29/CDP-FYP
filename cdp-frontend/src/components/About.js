import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import fatimaImg from "../Images/fatima.jpeg";
import aliImg from "../Images/ali.jpeg"; // Placeholder for Syed Muhammad Ali's image
import khizarImg from "../Images/IMG_8487.jpg"; // Placeholder for Syed Khizar Ali's image

const About = React.forwardRef((props, ref) => {
  const [showDev, setShowDev] = useState(false);

  return (
    <div ref={ref} id="about" className="bg-white pt-4 pb-6 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="relative w-full min-h-[550px] md:min-h-[600px] lg:min-h-[650px] overflow-hidden rounded-lg shadow-lg">
          <div
            className={`flex transition-transform duration-700 ease-in-out w-[200%] ${
              showDev ? "-translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Slide 1 - About */}
            <div className="w-full md:w-1/2 px-4 flex items-center justify-center min-h-[550px]">
              <div className="text-center max-w-2xl">
                <h6 className="text-gray-600 uppercase tracking-widest text-sm">
                  All About Our Campus
                </h6>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  About Career Development Portal
                </h2>
                <h4 className="text-xl font-semibold text-blue-600 mt-4">
                  Welcome to the Career Services and Industrial Liaison Office
                  Portal of FAST National University Karachi.
                </h4>
                <p className="text-gray-700 mt-4">
                  We are passionate about connecting talented individuals with
                  their dream careers and empowering organizations to find the
                  perfect fit for their teams.
                  <br />
                  <br />
                  <span className="font-bold">Our mission</span> is to bridge
                  the gap between job seekers and employers, creating meaningful
                  professional connections.
                </p>
                <p className="text-gray-700 mt-4">
                  Whether you're starting out or leveling up your career, we're
                  here for you.
                </p>
                <blockquote className="border-l-4 border-blue-500 pl-4 mt-4 italic text-gray-600">
                  "Thank you for choosing us as your partner in career growth."
                </blockquote>
                <div className="mt-6">
                  <p className="text-gray-700">
                    Ready to get started?{" "}
                    <Link to="/signup" className="text-blue-500">
                      Sign Up
                    </Link>{" "}
                    /{" "}
                    <Link to="/signin" className="text-blue-500">
                      Log In
                    </Link>
                  </p>
                  <button
                    onClick={() => setShowDev(true)}
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Meet the Developers 🚀
                  </button>
                </div>
              </div>
            </div>

            {/* Slide 2 - Developers */}
            <div className="w-full md:w-1/2 px-4 flex items-center justify-center min-h-[550px]">
              <div className="text-center w-full max-w-5xl">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">
                  About the Developers
                </h2>
                <p className="italic text-gray-600 mb-8">
                  "Made with ❤️ by FASTians passionate about innovation and
                  impact."
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-4">
                  {/* Developer 1 */}
                  <a
                    href="https://www.linkedin.com/in/syed-khizar-ali-091520326/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 p-6 flex flex-col items-center text-center cursor-pointer"
                  >
                    <img
                      src={khizarImg}
                      alt="Syed Khizar Ali"
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
                    />
                    <h3 className="mt-4 text-xl font-bold text-gray-800">
                      Syed Khizar Ali
                    </h3>
                    <p className="text-sm text-gray-500">21K-3329</p>
                    <p className="text-sm text-blue-600">
                      Full Stack Developer
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      We didn’t just build a portal — we built a launchpad for
                      every student's career.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      s.khizarali03@gmail.com
                    </p>
                    <FaLinkedin className="mt-3 text-blue-600 text-2xl" />
                  </a>

                  {/* Developer 2 */}
                  <a
                    href="https://www.linkedin.com/in/fatima-ali-680442244/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 p-6 flex flex-col items-center text-center cursor-pointer"
                  >
                    <img
                      src={fatimaImg}
                      alt="Fatima Ali"
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
                    />
                    <h3 className="mt-4 text-xl font-bold text-gray-800">
                      Fatima Ali
                    </h3>
                    <p className="text-sm text-gray-500">21K-3249</p>
                    <p className="text-sm text-blue-600">Frontend Developer</p>
                    <p className="text-sm text-gray-600 mt-2">
                      This isn’t just UI — it’s the front door to opportunity.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      sfatimali.003@gmail.com
                    </p>
                    <FaLinkedin className="mt-3 text-blue-600 text-2xl" />
                  </a>

                  {/* Developer 3 */}
                  <a
                    href="https://www.linkedin.com/in/syed-muhammad-ali-b942502aa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 p-6 flex flex-col items-center text-center cursor-pointer"
                  >
                    <img
                      src={aliImg}
                      alt="Syed Muhammad Ali"
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
                    />
                    <h3 className="mt-4 text-xl font-bold text-gray-800">
                      Syed Muhammad Ali
                    </h3>
                    <p className="text-sm text-gray-500">21K-3335</p>
                    <p className="text-sm text-blue-600">Backend Developer</p>
                    <p className="text-sm text-gray-600 mt-2">
                      We are helping students level up — one API at a time.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      malizaidi129@gmail.com
                    </p>
                    <FaLinkedin className="mt-3 text-blue-600 text-2xl" />
                  </a>
                </div>

                <button
                  onClick={() => setShowDev(false)}
                  className="mt-10 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  ← Back to About
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default About;