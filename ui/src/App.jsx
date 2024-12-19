import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LoginForm from './pages/Login';
import RegisterForm from './pages/RegisterForm';
import Profile from './pages/Profile';
import Search from './pages/Search';

import { AuthProvider } from './context/AuthProvider';
import RequireAuth from './components/RequireAuth';

import PrivateRoute from './utils/PrivateRoute';

import './index.css';

const App = () => {
  return (
    <div className="app bg-slate-950 text-white">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/user/:username" element={<Profile />} />

            {/* protected  routes */}
            <Route element={<RequireAuth />} >
            <Route path="/profile" element={<Profile />} />
            </Route>
            {/* <Route path="/profile" element={<Profile />} /> */}

          </Routes>
        </AuthProvider>
      </BrowserRouter >
    </div>
  );
};

export default App;
