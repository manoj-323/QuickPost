import React, { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import heart from "../assets/heart.png";
import red_heart from "../assets/red_heart.png";
import axios from "../utils/axios";

// Define the API base URL to avoid repetition
const API_URL = "http://127.0.0.1:8000";

const Post = ({ data, setData }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const privateAxios = useAxiosPrivate();

  // Store comment data and open/close state for each post
  const [commentBoxStates, setCommentBoxStates] = useState({});

  // Handle like button click
  const handleLike = async (postId) => {
    if (!auth.accessToken) return navigate('/login');

    try {
      const { data } = await privateAxios.post(`${API_URL}/like/`, { post_id: postId });
      setData((prevData) =>
        prevData.map((item) =>
          item.id === postId ? { ...item, upvote: data.upvote, is_liked: data.is_liked } : item
        )
      );
    } catch (err) {
      console.error("Like Error:", err);
    }
  };

  // Handle comment input change
  const handleCommentChange = (e, postId) => {
    setCommentBoxStates((prevStates) => ({
      ...prevStates,
      [postId]: { ...prevStates[postId], userComment: e.target.value },
    }));
  };

  // Handle comment submission
  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const userComment = commentBoxStates[postId]?.userComment;

    if (!userComment) return;
    if (!auth.accessToken) return navigate('/login');

    try {
      await privateAxios.post(`${API_URL}/make-comment/`, {
        post_id: postId,
        comment_text: userComment,
      });

      // Fetch new comments
      const { data } = await axios.get(`${API_URL}/comments/?post_id=${postId}`);
      setCommentBoxStates((prevStates) => ({
        ...prevStates,
        [postId]: {
          ...prevStates[postId],
          comments: data,
          userComment: "", // Clear input field after submit
          isOpen: true,
        },
      }));
    } catch (err) {
      console.error("Comment Submit Error:", err);
    }
  };

  // Toggle comment box visibility and load comments
  const toggleCommentBox = async (e, postId) => {
    e.preventDefault();

    // If comments are already fetched and the box is open, just toggle the visibility
    if (commentBoxStates[postId]?.comments) {
      setCommentBoxStates((prevStates) => ({
        ...prevStates,
        [postId]: { ...prevStates[postId], isOpen: !prevStates[postId]?.isOpen },
      }));
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/comments/?post_id=${postId}`);
      setCommentBoxStates((prevStates) => ({
        ...prevStates,
        [postId]: { isOpen: true, comments: data },
      }));
    } catch (err) {
      console.error("Fetch Comments Error:", err);
    }
  };

  return (
    <>
      {data.map((item) => {
        const timeAgo = formatDistanceToNowStrict(new Date(item.created_at)) + " ago";

        return (
          <div key={item.id} className="post w-full p-4 mb-4 bg-[#1c1e21] border-b border-b-[#323334] rounded-lg flex flex-row">
            <div className="flex items-start space-x-3">
              <img
                className="h-10 rounded-full"
                src={item.profile_image || `${API_URL}/media/profile_picture/default_pfp.png`}
                alt="Profile"
              />
            </div>

            <div className="flex-1 pl-1">
              <div className="inline-block w-full text-start">
                <div className="flex flex-row justify-start space-x-2 items-center">
                  <Link to={auth?.user?.username !== item.username ? `/user/${item.username}` : `/profile`} key={item.username}>
                    <p className="text-white font-semibold text-sm">{item.username}</p>
                  </Link>
                  <p className="text-gray-400 text-xs">{timeAgo}</p>
                </div>
                <p className="text-sm">{item.text}</p>
              </div>

              {item.post_image && (
                <div className="mb-3">
                  <img className="h-48 object-cover rounded-md" src={item.post_image} alt="Post" />
                </div>
              )}

              <div className="flex justify-between items-center text-gray-400 text-sm mt-3">
                <div className="flex space-x-4">
                  <button
                    className="hover:text-white px-0 py-1 rounded-md"
                    onClick={() => handleLike(item.id)}
                  >
                    <div className="flex space-x-1 items-center">
                      <img src={item.is_liked ? red_heart : heart} alt="like button" className="h-5" />
                      <p>{item.upvote}</p>
                    </div>
                  </button>
                  <button
                    className="hover:text-white"
                    onClick={(e) => toggleCommentBox(e, item.id)}
                  >
                    Comment
                  </button>
                </div>
              </div>

              {commentBoxStates[item.id]?.isOpen && (
                <div className="pl-5 p-1 max-h-48 overflow-scroll no-scrollbar bg-[#212428] rounded-2xl">
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full p-2 bg-gray-800 rounded-md text-white"
                      value={commentBoxStates[item.id]?.userComment || ""}
                      onChange={(e) => handleCommentChange(e, item.id)}
                    />
                    <button onClick={(e) => handleCommentSubmit(e, item.id)} className="mt-2">
                      Comment
                    </button>
                  </div>
                  {commentBoxStates[item.id]?.comments?.map((comment) => (
                    <div key={comment.id} className="flex p-4 border-b border-gray-600">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={comment.user.profile_image || `${API_URL}/media/profile_picture/default_pfp.png`}
                        alt={comment.user.username}
                      />
                      <div className="flex flex-col w-full text-start pl-2">
                        <p className="text-white font-semibold">{comment.user.username}</p>
                        <div className="text-gray-300 text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Post;
