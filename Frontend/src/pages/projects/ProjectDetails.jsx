import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaTimes } from "react-icons/fa";
import { bid, fetchProjectDetails } from "../../API/projects";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {Badge} from "../../components/ui/badge";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { addToList, removeItemFromList } from "../../API/list";
import { useToast } from "../../hooks/use-toast";
import BidComponent from "./BidComponent";

const ProjectDetails = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const skills = useSelector((state) => state.general.skills);
  const user = useSelector((state) => state.auth.user);

  const [bidAmount, setBidAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [proposal, setProposal] = useState("");
  const [milestoneDetails, setMilestoneDetails] = useState([
    { description: "", amount: "" },
  ]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetchProjectDetails(id);
        console.log("got project:->", response);
        setProject(response.data);
      } catch (err) {
        setProject({ id: "" });
        console.log("Failed to fetch project details. Please try again.", err);
        toast({
          title: "Error fetching Project details",
          description: err?.response?.data?.message,
        });
      } finally {
        // setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...milestoneDetails];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setMilestoneDetails(updatedMilestones);
  };

  const addMilestone = () => {
    setMilestoneDetails([...milestoneDetails, { description: "", amount: "" }]);
  };

  const cancelMilestone = (index) => {
    const updatedMilestones = milestoneDetails.filter((_, i) => i !== index);
    setMilestoneDetails(updatedMilestones);
  };

  const validateForm = () => {
    if (
      !bidAmount ||
      bidAmount < project.minBudget ||
      bidAmount > project.maxBudget
    ) {
      setError(
        `Bid amount must be between ${project.minBudget} and ${project.maxBudget}.`
      );
      return false;
    }
    if (!deliveryTime || deliveryTime < 1) {
      setError("Delivery time must be at least 1 day.");
      return false;
    }
    if (proposal.length < 100) {
      setError("Proposal must be at least 100 characters long.");
      return false;
    }
    for (let milestone of milestoneDetails) {
      if (
        !milestone.description ||
        !milestone.amount ||
        milestone.amount <= 0
      ) {
        setError(
          "All milestone fields must be filled and amount should be greater than zero."
        );
        return false;
      }
    }
    setError("");
    return true;
  };

  async function handleBookMarkClick() {
    try {
      if (!user) throw new Error("Login Required");
      let response;
      if (!project.isBookmarked) {
        response = await addToList("bookmark", "PROJECT", id);
        setProject({ ...project, isBookmarked: true });
      } else {
        response = await removeItemFromList("bookmark", id);
        setProject({ ...project, isBookmarked: false });
      }
      toast({
        title: response.data.message,
      });
    } catch (err) {
      console.error("error in adding to bookmark: ", err);
      console.log("message:->", err.message || err.response?.data.message);
      toast({
        variant: "destructive",
        title: err.message || err.response.data.message,
      });
    }
  }

  async function handleBidClick() {
    try {
      if (!user) throw new Error("Login Required");
      const response = await bid({
        bidAmount,
        deliveryTime,
        proposal,
        milestoneDetails,
        id,
      });
      setProject({ ...project, ...response.data });
    } catch (err) {
      console.log("error bidding:->", err.response.data.message || err.message);
      toast({
        variant: "destructive",
        title: err.response?.data?.message || err.message,
        duration: 2000,
      });
    }
  }

  if (!project) {
    return <Loader />;
  } else if (project.id == "") return <div>No project found</div>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg h-full w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        {project.freelancer && <h1 className="text-2xl font-bold">Assigned to: {project.freelancer.name}</h1>}
        <div className="flex flex-col items-end">
          <p className="">No. of Bids: {project.noOfBids || 0}</p>
          <p className="text-xl font-semibold">
            Average Bid: {project.averageBidBudget || "-"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="details">
        <div className="flex justify-between items-center">
          <TabsList className="bg-white flex gap-2 justify-start m-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            {project.assignedTo && <TabsTrigger value="status">Status</TabsTrigger>}
          </TabsList>
          <div className="flex items-center gap-2">
            {/* <button className="p-0" onClick={handleBookMarkClick}> */}
            {user &&
              (project.isBookmarked ? (
                <button
                  className="p-0 hover:border-none border border-1 rounded-circle bg-danger"
                  onClick={handleBookMarkClick}
                >
                  <p className="border rounded-full p-3 py-2">
                    <BookmarkCheck className="w-6 h-6 text-blue-500" />
                  </p>
                </button>
              ) : (
                <button
                  className="p-0 hover:border-none border border-1 rounded-circle bg-success"
                  onClick={handleBookMarkClick}
                >
                  <p className="border rounded-full p-3 py-2">
                    <Bookmark className="w-6 h-6 text-blue-500" />
                  </p>
                </button>
              ))}
            {/* {project.bookmark ? (
              <BookmarkCheck className="w-6 h-6 text-blue-500" />
            ) : (
              <Bookmark className="w-6 h-6 text-gray-500" />
            )} */}
            {/* </button> */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  className="text-white bg-blue-500 py-2 px-3"
                  onClick={() => setOpen(true)}
                >
                  Bid
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <p className="text-xl font-bold">Describe your Proposal</p>
                </DialogHeader>
                {/* <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-50"> */}
                {/* <h2 className="text-lg font-semibold">Place a Bid</h2> */}
                <label className="block mt-2">Bid Amount ($)</label>
                <input
                  type="number"
                  className="border rounded p-2 w-full"
                  placeholder="Enter bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
                <label className="block mt-2">Delivery Time (Days)</label>
                <input
                  type="number"
                  className="border rounded p-2 w-full"
                  placeholder="Enter delivery time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  required
                />
                <label className="block mt-2">Your Proposal</label>
                <textarea
                  className="border rounded p-2 w-full"
                  placeholder="Write your proposal (min 100 characters)"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  required
                />
                <h3 className="mt-4 font-semibold">Milestones Payment</h3>
                {milestoneDetails.map((milestone, index) => (
                  <div key={index} className="mt-2 flex items-center">
                    <input
                      type="text"
                      className="border rounded p-2 w-full"
                      placeholder="Milestone description"
                      value={milestone.description}
                      onChange={(e) =>
                        handleMilestoneChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      required
                    />
                    <input
                      type="number"
                      className="border rounded p-2 w-full ml-2"
                      placeholder="Amount ($)"
                      value={milestone.amount}
                      onChange={(e) =>
                        handleMilestoneChange(index, "amount", e.target.value)
                      }
                      required
                    />
                    <FaTimes
                      className="text-red-500 cursor-pointer ml-2"
                      onClick={() => cancelMilestone(index)}
                    />
                  </div>
                ))}
                <button
                  onClick={addMilestone}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Milestone
                </button>
                {/* </div> */}
                <DialogFooter>
                  <div className="flex flex-col justify-center items-center w-full">
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                      onClick={() =>
                        validateForm() && handleBidClick() && setOpen(false)
                      }
                      className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                      Submit Bid
                    </button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <hr />
        <TabsContent value="details">
          <div className="grid grid-cols-3 gap-6 overflow-y-auto overflow-x-hidden">
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mt-4">Project Details</h2>
              <p className="text-gray-600">{project.description}</p>
              {/* <ul className="list-disc pl-5 text-gray-600">
                    {project.functions.map((func, index) => (
                      <li key={index}>{func}</li>
                    ))}
                </ul> */}
              {/* <h3 className="mt-4 font-semibold">Project Type</h3> */}
              <div className="flex mt-4 gap-2">
                <p className="font-semibold">Purpose:</p>
                <p>{project.purpose || "-"}</p>
              </div>
              <div className="flex mt-4 gap-2">
                <p className="font-semibold">Platform:</p>
                <p>{project.platform || "-"}</p>
              </div>
              <div className="flex mt-4 gap-2">
                <p className="font-semibold">Payment method:</p>
                <p>{project.inProjectPaymentMethod || "-"}</p>
              </div>
              <h3 className="mt-4 font-semibold">Required Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
                  >
                    {skill && skills.find((s) => s.id == skill)?.name}
                  </span>
                ))}
              </div>
              <p className="mt-2 font-semibold">
                Budget: ${project.minBudget} - ${project.maxBudget} USD
              </p>
            </div>
            <div className="col-span-1 p-4 border rounded-lg shadow-md bg-gray-50">
              <h2 className="font-semibold">About the Client</h2>
              <p>{project.user.name}</p>
              <p>Location: {project.user.location}</p>
              <p>Member since: {project.user.dateJoined?.slice(0, 10)}</p>
              <h3 className="mt-2 font-semibold">Client Rating</h3>
              <div className="flex text-yellow-500 font-semibold text-xl">
                {"★".repeat(Math.round(project.user.rating))}
                {"☆".repeat(5 - Math.round(project.user.rating))}
              </div>
              <h3 className="mt-2 font-semibold">Client Verification</h3>
              <ul className="list-disc pl-5 text-gray-600">
                {/* {Object.entries(project.user.verified).map(([key, value]) => (
              <li key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                {value ? "Verified" : "Not Verified"}
              </li>
            ))} */}
                <li key={"phone"}>
                  {"Phone: "}
                  {project.user.phoneNumberVerified
                    ? "Verified"
                    : "Not Verified"}
                </li>
                <li key={"email"}>
                  {"Email: "}
                  {project.user.emailVerified ? "Verified" : "Not Verified"}
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="bids">
          <div className="flex flex-col gap-2 h-full">
            {project.bids.length > 0 ? (
              project.bids.map((bid) => <BidComponent bid={bid} />)
            ) : (
              <div>No Bids. Be the first to bid.</div>
            )}
          </div>
        </TabsContent>
        {project.assignedTo && <TabsContent value="status">
          <div className="space-y-6 p-4">
            <h2 className="text-2xl font-semibold">Project Milestones</h2>

            {project.milestones?.length === 0 ? (
              <p className="text-gray-500">No milestones defined yet.</p>
            ) : (
              <ul className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <li
                    key={milestone.id}
                    className="border rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">
                          {index + 1}. {milestone.description}
                        </h3>
                      </div>
                      <Badge
                        variant={
                          milestone.isCompleted ? "success" : "secondary"
                        }
                      >
                        {milestone.isCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>}
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
