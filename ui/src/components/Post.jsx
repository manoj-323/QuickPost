import React from 'react';

const Post = ({ post }) => {
  return (
    <div className="mx-auto md:w-2/3  text-white border p-4 mb-4 rounded-lg border-red-600 h-32 w-60 overflow-hidden">
      <div className="flex items-center mb-4">
        <img className="h-8 w-8 rounded-full mr-2" src="http://localhost:8000/profilePicture/default-pfp.png" alt="Profile" />
        <p>{post.username}</p>
      </div>
      <div className="post-body mb-4">
        <p>{post.text}</p>
        {post.image && <img src={post.image} alt="Post image" className="w-full h-auto mt-2 rounded-lg object-cover" />}
      </div>
      <div className="post-footer flex justify-between mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">Like {post.upvote}</button>
        <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">Comment</button>
      </div>
    </div>
  );
};

export default Post;
