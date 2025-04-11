import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react'; // For like/dislike icons

const Blog = ({ isHighlighted }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const description = `
    This is a sample blog description that gives insight into the topic. 
    It may contain multiple lines to explain the content in detail. 
    Keep reading to explore more information about this amazing blog post.
  `;
  
  const truncatedDescription = description.split(' ').slice(0, 20).join(' ');

  return (
    <div
      className={`bg-white p-4 shadow-md rounded-lg border border-gray-300 
      ${isHighlighted ? 'border-2 border-blue-500' : ''}`}
    >
      {/* Blog Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <div>
          <h3 className="font-bold">John Doe</h3>
          <p className="text-sm text-gray-500">Posted on March 10, 2025</p>
        </div>
        <p className="text-sm text-gray-400">#Technology</p>
      </div>

      {/* Blog Description */}
      <p className="text-gray-700">
        {showFullDescription ? description : truncatedDescription}...
        <button
          className="text-blue-500 ml-2 underline"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? 'Show Less' : 'Read More'}
        </button>
      </p>

      {/* Like and Dislike Section */}
      <div className="flex items-center gap-4 mt-3">
        <button
          className="flex items-center gap-1 text-green-500"
          onClick={() => setLikes(likes + 1)}
        >
          <ThumbsUp size={18} /> {likes}
        </button>

        <button
          className="flex items-center gap-1 text-red-500"
          onClick={() => setDislikes(dislikes + 1)}
        >
          <ThumbsDown size={18} /> {dislikes}
        </button>
      </div>
    </div>
  );
};

export default Blog;

