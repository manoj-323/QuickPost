import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import NavigationBar from '../components/NavigationBar';
import { useParams, useNavigate, replace, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const Profile = () => {

  const [profileData, setProfileData] = useState();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  const { setAuth, isAuthenticated, setIsAuthenticated } = useAuth();

  const logout = () => {
    console.log('logging out');
    setAuth({});
    setIsAuthenticated(false);
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    console.log('on profile')

    const getProfile = async () => {
      console.log('fetching profile')
      try {
        const response = await axiosPrivate.get('http://127.0.0.1:8000/profile/', {
          signal: controller.signal
        });
        console.log(response.data)
        setProfileData(response.data)
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true })
      }
    }
    getProfile();

    return () => {
      isMounted = false; // Cleanup flag
      controller.abort(); // Abort the request on unmount
    };

  }, [])


  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />

      <div className="flex flex-grow">
        <div className="sm:w-16 w-full sm:h-full h-16 sm:relative absolute bottom-0 left-0 sm:flex flex-col items-center sm:space-y-5 space-x-7 sm:space-x-0 bg-[#0A0A0A] text-white shadow-lg">
          <Sidebar />
        </div>

        <div className="flex-grow p-6">


          <div className="border bg-blue-700 p-4 rounded-lg text-white">
            <h1 className="text-2xl font-bold">{profileData?.name}</h1>
            <p className="mt-2">{profileData?.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
