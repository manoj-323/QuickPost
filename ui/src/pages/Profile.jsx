import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import Sidebar from '../components/Sidebar';
import NavigationBar from '../components/NavigationBar';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import Post from '../components/Post';
import EditProfile from '../components/EditProfile';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowersVisible, setIsFollowersVisible] = useState(false);  // State to track visibility of the followers list
  const [isFollowingVisible, setIsFollowingVisible] = useState(false);  // State to track visibility of the following list
  const [isEditingProfile, setIsEditingProfile] = useState(false); // Track editing state
  const [loading, setLoading] = useState(true); // Track loading state
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, setIsAuthenticated } = useAuth();
  const { username } = useParams();

  const handleFollowOrEdit = async () => {
    if (username) {
      followUser(profileData?.id);
    } else {
      setIsEditingProfile(true);
    }
  };

  const followerListToggle = () => {
    if (isFollowingVisible) {
      setIsFollowingVisible(false);
    }
    setIsFollowersVisible((prev) => !prev);
  };

  const followingListToggle = () => {
    if (isFollowersVisible) {
      setIsFollowersVisible(false);
    }
    setIsFollowingVisible((prev) => !prev);
  };

  const followUser = async (followed_id) => {
    try {
      let response;
      if (!profileData?.is_following) {
        response = await axiosPrivate.post('followers/follow/', { followed_id });
      } else {
        response = await axiosPrivate.delete('followers/follow/', { data: { followed_id } });
      }
      setProfileData((prev) => ({
        ...prev,
        is_following: response.data?.is_following,
        follower_count: response.status === 204 ? prev.follower_count - 1 : prev.follower_count + 1,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const getFollowers = async () => {
    try {
      const response = await axiosPrivate.get('followers/followers/', {
        params: { user_id: profileData?.id },
      });
      setProfileData((prev) => ({
        ...prev,
        followers: response.data,
        follower_count: response.data.length,
      }));
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const getFollowing = async () => {
    try {
      const response = await axiosPrivate.get('followers/following/', {
        params: { user_id: profileData?.id },
      });
      setProfileData((prev) => ({
        ...prev,
        following: response.data,
        following_count: response.data.length,
      }));
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const getProfile = async () => {
      try {
        setLoading(true);
        let response;
        if (username && isAuthenticated) {
          response = await axiosPrivate.get(`profiles/user/${username}/`, {
            signal: controller.signal,
          });
        } else if (username) {
          response = await axios.get(`profiles/user/${username}/`, {
            signal: controller.signal,
          });
        } else {
          response = await axiosPrivate.get('profiles/me/', {
            signal: controller.signal,
          });
        }
        setProfileData(response.data);
        getUserPosts();
      } catch (err) {
        if (err.response?.status === 404) {
          setProfileData(null);
        } else if (err.response?.status === 401) {
          navigate('/login', { state: { from: location }, replace: true });
        } else {
          console.error('An unexpected error occurred:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    const getUserPosts = async () => {
      let response;
      try {
        if (username) {
          response = await axios.get(`posts/user/${username}/`);
        } else {
          response = await axiosPrivate.get('posts/profile/');
        }
        setUserPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts', err);
      }
    };

    getProfile();

    return () => {
      controller.abort();
    };
  }, [location, navigate, username, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />
      <div className="flex flex-grow overflow-hidden">
        <div className="sm:w-16 w-full sm:h-full h-16 sm:relative absolute bottom-0 left-0 sm:flex flex-col items-center sm:space-y-5 space-x-7 sm:space-x-0 bg-[#0A0A0A] text-white shadow-lg">
          <Sidebar />
        </div>

        <div className="flex flex-grow p-1">
          <div className="scrollable-container bg-[#1c1e21] rounded-3xl p-1 mx-auto text-center overflow-y-auto no-scrollbar pb-12 border border-[#323232] w-[400px] max-h-[88vh]">
            {isEditingProfile && profileData ? (
              <EditProfile
                profileData={profileData}
                setProfileData={setProfileData}
                setIsEditingProfile={setIsEditingProfile}
              />
            ) : (
              <>
                <div className="flex items-center space-x-6 mb-4 mt-1">
                  <img
                    src={profileData?.profile_picture || 'http://127.0.0.1:8000/media/profile_picture/default_pfp.png'}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="text-white text-start">
                    <h1 className="text-2xl font-semibold">{profileData?.name}</h1>
                    <p className="text-sm">@{profileData?.username}</p>
                    <p className="mt-2">{profileData?.bio || 'No bio available'}</p>
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  <button
                    className={`${profileData?.is_following ? 'bg-gray-600' : 'bg-blue-600'} text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200`}
                    onClick={handleFollowOrEdit}
                  >
                    {!username ? 'Edit Profile' : profileData?.is_following ? 'Unfollow' : 'Follow'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <button onClick={() => {
                    if (!profileData?.followers) getFollowers();
                    followerListToggle();
                  }}>
                    <div className="flex flex-col items-center p-4 rounded-lg shadow-md">
                      <p className="text-2xl font-semibold text-white">{profileData?.follower_count}</p>
                      <p className="text-sm text-white">Followers</p>
                    </div>
                  </button>
                  <button onClick={() => {
                    if (!profileData?.following) getFollowing();
                    followingListToggle();
                  }}>
                    <div className="flex flex-col items-center p-4 rounded-lg shadow-md">
                      <p className="text-2xl font-semibold text-white">{profileData?.following_count || 0}</p>
                      <p className="text-sm text-white">Following</p>
                    </div>
                  </button>
                </div>

                {isFollowersVisible && profileData?.followers?.length > 0 && (
                  <div className="mt-4 max-h-52 overflow-auto no-scrollbar">
                    <h2 className="text-xl text-white">Followers</h2>
                    <ul className="list-none">
                      {profileData.followers.map((follower, index) => (
                        <li key={index} className="p-2 mb-2 rounded-lg shadow-md bg-gray-800 text-white">
                          <p>{follower.follower_name}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isFollowingVisible && profileData?.following?.length > 0 && (
                  <div className="mt-4 max-h-52 overflow-auto no-scrollbar">
                    <h2 className="text-xl text-white">Following</h2>
                    <ul className="list-none">
                      {profileData.following.map((following, index) => (
                        <li key={index} className="p-2 mb-2 rounded-lg shadow-md bg-gray-800 text-white">
                          <p>{following.followed_name}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-6 rounded-lg shadow-md border-y border-[#323334]">
                  <Post data={userPosts} setData={setUserPosts} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
