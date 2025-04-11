import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Project from "../../components/Project";
import { getAssignedProjects, getMyProjects } from "../../API/projects";
import { useSelector } from "react-redux";

export default function Projects() {
  const [type, setType] = useState("created");
  const [items, setItems] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    async function getItems(type) {
      if (type == "created") {
        const response = await getMyProjects();
        setItems(response.data.projects || []);
      } else if (type == "assigned") {
        const response = await getAssignedProjects();
        setItems(response.data.projects || []);
      } else if (type == "bids") {
      }
    }
    getItems(type);
  }, [type, user]);

  return (
    <>
      <Helmet>
        <title>Projects</title>
      </Helmet>
      {user ? (
        <div className="border h-full w-full overflow-y-hidden overflow-x-hidden p-3">
          <p className="font-semibold text-xl">Projects</p>
          <div className="flex h-full p-3 gap-2">
            <div className="border shadow flex flex-col justify-start items-start p-3 gap-2 h-full w-48 rounded">
              <button
                className={`w-full hover:border-0 border rounded p-0 text-left font-normal flex items-center ${
                  type == "created" ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => {
                  setType("created");
                }}
              >
                Created
              </button>
              <button
                className={`w-full hover:border-0 border rounded p-0 text-left font-normal flex items-center ${
                  type == "assigned" ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => {
                  setType("assigned");
                }}
              >
                Assigned
              </button>
              <button
                className={`w-full hover:border-0 border rounded p-0 text-left font-normal flex items-center ${
                  type == "bids" ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => {
                  setType("bids");
                }}
              >
                Bids
              </button>
            </div>
            <div className="p-3 flex-1 h-full shadow border rounded">
              {items.length>0 ? (
                items.map((item) => {
                  return <Project project={item} />;
                })
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  Empty List
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">Login First</div>
      )}
    </>
  );
}
