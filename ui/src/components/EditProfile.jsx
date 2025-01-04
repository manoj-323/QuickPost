import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const EditProfile = ({ profileData, setProfileData, setIsEditingProfile }) => {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        profile_picture: null,
    });

    const [error, setError] = useState(null); // State to handle error messages
    const axiosPrivate = useAxiosPrivate();

    // Set initial form data when profileData changes
    useEffect(() => {
        setFormData({
            name: profileData.name || '',
            bio: profileData.bio || '',
            profile_picture: profileData.profile_picture || null,
        });
    }, [profileData]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle file input changes (Profile Picture)
    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            profile_picture: e.target.files[0],
        }));
    };

    // Save profile changes
    const handleSaveProfile = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            setError("Name is required");
            return;
        }

        setError(null); // Reset error message before submitting the form

        const form = new FormData();
        form.append('name', formData.name);
        form.append('bio', formData.bio);
        if (formData.profile_picture) {
            form.append('profile_picture', formData.profile_picture);
        }

        try {
            const response = await axiosPrivate.put('profiles/me/', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response)
            setProfileData(response.data); // Update profile data in parent component
            setIsEditingProfile(false); // Exit editing mode
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to save changes. Please try again.');
        }
    };

    return (
        <div className="bg-[#1c1e21] rounded-3xl p-6 text-center pb-12 border border-[#323232]">
            <div className="flex items-center space-x-6 mb-4 mt-1">
                <img
                    src={formData.profile_picture || 'http://127.0.0.1:8000/media/profile_picture/default_pfp.png'}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                />
                <div className="text-white">
                    <label htmlFor="upload-photo" className="cursor-pointer text-blue-600 hover:underline">
                        New Profile Picture
                    </label>
                    <input
                        type="file"
                        id="upload-photo"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Display error message if any */}
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="text-white text-start">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-semibold">Name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 text-lg bg-[#333] text-white rounded-md border border-[#444] focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Your full name"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-semibold">Username:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={profileData.username} // Username can't be edited in this case
                        disabled
                        className="w-full p-2 text-lg bg-[#333] text-white rounded-md border border-[#444] focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-semibold">Bio:</label>
                    <textarea
                        name="bio"
                        id="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full p-2 text-lg bg-[#333] text-white rounded-md border border-[#444] focus:outline-none focus:ring-2 focus:ring-blue-600"
                        rows="4"
                        placeholder="Write something about yourself"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                    onClick={handleSaveProfile}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditProfile;
