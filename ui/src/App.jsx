import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LoginForm from './pages/Login.jsx';
import RegisterForm from './pages/RegisterForm.jsx';

import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';

import './index.css';

const App = () => {
  return (
    <div className="app bg-slate-950 text-white">
      <Router>
        
      <NavigationBar />
      <Sidebar />
          <main className="bg-slate-950">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </main>
      </Router>
    </div>
  );
};

export default App;
