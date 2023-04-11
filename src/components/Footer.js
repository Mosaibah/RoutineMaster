// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 flex flex-col items-center justify-center font-light">
      <p className="font-light mb-1">Developed by <a href="https://github.com/mosaibah" className='underline'>Abdulrahman</a></p>
      <p className="mb-4">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
      <div className="flex space-x-4">
        <a
          href="https://twitter.com/proabdulrahmna"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300"
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          href="https://github.com/mosaibah/RoutineMaster"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300"
        >
          <i className="fab fa-github"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
