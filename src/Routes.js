//Routes.js
// Компонент маршрутизации
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Photo from './Photo'; 
import Autf from './Autf'; 
import Codeword from './Codeword';
import Start from './Start';
import Other from './Other';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/photo/:uuid" element={<Photo />} />
        <Route path="/autf/:uuid" element={<Autf />} />
        <Route path="/codeword/:uuid" element={<Codeword />} />
        <Route path="/other/:uuid" element={<Other />} />
        <Route path="/start" element={<Start />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;