import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
  const skills = useSelector((state) => state.general.skills);
  const [showFullBio, setShowFullBio] = useState(false);
  const BIO_TRUNCATE_LENGTH = 150;
  const navigate = useNavigate();

  const displayedBio =
    showFullBio || user.bio?.length <= BIO_TRUNCATE_LENGTH
      ? user.bio
      : user.bio?.slice(0, BIO_TRUNCATE_LENGTH) + "...";

  return (
    <div
      className="border border-gray-300 rounded-lg p-4 flex mb-4 font-sans cursor-pointer hover:bg-gray-100"
      onClick={() => {
        navigate(`/profile/${user.id}`);
      }}
    >
      <div className="mr-4">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="User Logo"
            className="w-20 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-1">{user.name || user.id}</h2>
        {/* <p className="text-lg font-semibold text-blue-600">
          ${user.rate} USD per hour
        </p> */}
        <p className="text-gray-600">{user.location}</p>
        <div className="flex items-center gap-2 mt-2">
          {/* <span className="font-bold">Rating: {user.rating || "-"}</span> */}
          <span className="flex">
            {[1, 2, 3, 4, 5].map((i) => {
              return (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i <= user.rating ? "text-yellow-200" : "text-gray-300"
                  }`}
                  fill={i <= user.rating ? "yellow" : "none"}
                  // stroke={i <= user.rating ? "blue" : "blue"}
                />
              );
            })}
          </span>
          {/* <span className="text-gray-500">({user.reviews} reviews)</span> */}
        </div>
        <div className="mt-2">
          <span>{displayedBio}</span>
          {user.bio?.length > BIO_TRUNCATE_LENGTH && (
            <span
              onClick={(event) => {
                event.stopPropagation(); // Prevents triggering the card's onClick event
                setShowFullBio(!showFullBio);
              }}
              className="mt-1 text-blue-500 hover:underline cursor-pointer"
            >
              {showFullBio ? "Show Less" : "Show More"}
            </span>
          )}
        </div>
        <div className="mt-3">
          {user.skills &&
            user.skills.map(
              (skill, index) =>
                skill && (
                  <span
                    key={index}
                    className="inline-block mr-2 mb-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {(skills.find((s) => s.id == skill) || {})?.name}{" "}
                  </span>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
