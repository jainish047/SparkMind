import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectUpdates() {
  const [activeTab, setActiveTab] = useState("inProgress");

  const updates = {
    inProgress: [
      {
        id: 1,
        title: "Milestone 1 Completed",
        content:
          "We've successfully completed the first milestone: Initial Setup. Next, we'll be working on UI implementation."
      },
      {
        id: 2,
        title: "Feature Added",
        content: "We've added a real-time chat feature to enhance collaboration."
      },
      {
        id: 3,
        title: "Database Integration",
        content: "The database has been successfully integrated to store user and project data."
      },
      {
        id: 4,
        title: "UI Enhancements",
        content: "New UI components have been added for a better user experience."
      }
    ],
    completed: [
      {
        id: 5,
        title: "Final Deployment",
        content:
          "The project has been successfully deployed. Thank you for your cooperation!"
      },
      {
        id: 6,
        title: "Bug Fixes",
        content:
          "All reported bugs have been fixed, ensuring a smooth user experience."
      },
      {
        id: 7,
        title: "Performance Optimization",
        content: "The application has been optimized for better speed and efficiency."
      }
    ]
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6 space-y-4 md:space-y-0">
        <Button
          className={`w-full md:w-auto px-6 py-2 rounded-full transition-all ${
            activeTab === "inProgress" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("inProgress")}
        >
          In Progress
        </Button>
        <Button
          className={`w-full md:w-auto px-6 py-2 rounded-full transition-all ${
            activeTab === "completed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </Button>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Stay Engaged with Project Updates!
      </h2>

      <div className="flex flex-col space-y-6">
        {updates[activeTab].map((update) => (
          <Card key={update.id} className="p-4 md:p-6 shadow-md rounded-lg bg-gray-50 border border-gray-200">
            <CardContent>
              <h3 className="text-lg md:text-xl font-semibold text-blue-700">{update.title}</h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base">{update.content}</p>
              <div className="mt-4 text-right">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs md:text-sm font-medium">
                  See Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button className="bg-pink-600 hover:bg-pink-700 text-white px-6 md:px-8 py-3 rounded-full font-semibold text-sm md:text-lg shadow-md transition-all">
          Browse Projects
        </Button>
      </div>
    </div>
  );
}
