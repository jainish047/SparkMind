import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Project({ project }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  const skills = useSelector((state) => state.general.skills);

  // Hardcoded project data
  // const project = {
  //   ownerName: 'John Doe',
  //   budgetRange: { min: 1000, max: 5000 },
  //   description:
  //     'This is a detailed project description that explains the requirements and goals of the project. It may span multiple lines and provide insights into what the project entails. This project requires a skilled developer with experience in React, Node.js, and MongoDB.',
  //   requiredSkills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
  //   averageBidPrice: 2500,
  //   totalBids: 12,
  // };

  // async function handleBookmarkClick() {
  //   try {
  //     if (!user) throw new Error("Login Required");
  //     const response = await addToList("bookmark", "PROJECT", id);
  //     setProject(response.data.project);
  //     toast({
  //       title: response.data.message,
  //     });
  //   } catch (err) {
  //     console.error("error in adding to bookmark: ", err);
  //     console.log("message:->", err.message || err.response?.data.message);
  //     toast({
  //       variant: "destructive",
  //       title: err.message || err.response.data.message,
  //     });
  //   }
  // }

  const toggleDescription = (event) => {
    event.stopPropagation(); // Prevents triggering the card's onClick event
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 border hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        navigate(`/projects/${project.id}`);
      }}
    >
      {/* Project Owner Name */}
      <div className="flex justify-between mb-2">
        <div className="">
          <p className="text-xl font-bold text-blue-600">{project.title}</p>
          <p className="">{project.user.name}</p>
        </div>

        {/* Average Bid Price and Total Bids */}
        <div className="flex flex-col items-start">
          <div>
            <span className="text-gray-600">Average Bid: </span>
            <span className="font-medium">${project.averageBidBudget || " -"}</span>
          </div>
          <div>
            <span className="text-gray-600">Total Bids: </span>
            <span className="font-medium">{project.noOfBids || 0}</span>
          </div>
        </div>
      </div>

      {/* Project Budget Range */}
      <div className="mb-2">
        <span className="text-gray-600">Budget: </span>
        <span className="font-medium">
          ${project.minBudget} - ${project.maxBudget}
        </span>
      </div>

      {/* Project Description with See More Toggle */}
      <div className="mb-2">
        <span className="text-gray-700">
          {showFullDescription
            ? project.description
            : `${project.description.substring(0, 150)}${
                project.description.length > 150 ? "..." : ""
              }`}
        </span>
        {project.description.length > 150 && (
          <span
            onClick={(event) => {
              toggleDescription(event);
            }}
            className="cursor-pointer text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-0"
          >
            {showFullDescription ? "show Less" : "show More"}
          </span>
        )}
      </div>

      <div className="flex justify-between items-end">
        {/* Required Skills */}
        <div className="">
          <h4 className="text-gray-600 font-medium mb-2">Required Skills:</h4>
          <div className="flex flex-wrap">
            {project.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm mr-2 mb-2"
              >
                {(skills.find((s) => s.id == skill) || {})?.name}
              </span>
            ))}
          </div>
        </div>

        {/* Save/Bookmark Button */}
        {/* <button
          className="flex items-center text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-0 p-0"
          onClick={(event) => {
            event.stopPropagation();
            // add to bookmark list
            handleBookmarkClick();
          }}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            ></path>
          </svg>
          Save Project
        </button> */}
      </div>
    </div>
  );
}
