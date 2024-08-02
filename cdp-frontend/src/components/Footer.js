import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm md:text-base">
              Copyright All Right Reserved {currentYear} | Developed By: CDP Team
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/fastnuceskhi_official/" className="text-white hover:text-pink-600" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="text-lg" />
            </a>
            <a href="https://twitter.com/khi_nuces" className="text-white hover:text-blue-400" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} className="text-lg" />
            </a>
            <a href="https://www.facebook.com/FASTNUCESKHI" className="text-white hover:text-blue-600" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} className="text-lg" />
            </a>
            <a href="https://www.youtube.com/channel/UCDDvOIOvZMpT1XPzfFfLcFg" className="text-white hover:text-red-600" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
