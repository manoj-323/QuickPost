import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const MakePost = () => {
    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const privateAxios = useAxiosPrivate();

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
        setErr('');
    };

    const handleClose = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr('');

        const formData = new FormData();
        formData.append('text', postText);

        if (postImage) {
            formData.append('post_image', postImage);
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await privateAxios.post('http://127.0.0.1:8000/post/', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                }
                }
            );
            console.log("Post created:", response.data);
            alert("Post created successfully!");

            // Clear form data after successful post
            setPostText('');
            setPostImage(null);
            togglePopup();
        } catch (err) {
            console.error(err);
            setErr("Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        togglePopup(); // Open the popup on component mount
    }, []);

    return (
        <div className="relative">
            {/* Popup */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
                <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 shadow-lg">
                    <button
                        onClick={() => {
                            togglePopup();
                            handleClose();
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl focus:outline-none"
                    >
                        &times;
                    </button>
                    <h3 className="text-xl font-semibold mb-4 text-center">Create a Post</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>

                        <div>
                            <label className="block mb-2 text-sm text-gray-600">Upload an image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPostImage(e.target.files[0])}
                                className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-200 hover:file:bg-gray-300"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-2 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                            disabled={loading}
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                    {err && <p className="text-red-500 text-sm mt-3">{err}</p>}
                </div>
            </div>
        </div>
    );
};

export default MakePost;
