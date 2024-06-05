//Routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Photo from './Photo'; 
import Autf from './Autf'; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/photo/:login" element={<Photo />} />
        <Route path="/autf/:login" element={<Autf />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;