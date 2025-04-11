import { api } from "./axiosConfig";

const fetchProjects = async (filters) => {
  try {
    console.log("filters in api call->", filters);
    return api.get("/projects", { params: filters });
  } catch (err) {
    console.log("error in projects fetch:->", err);
  }
};

const postProject = async (details) => {
  try {
    console.log("project details in api call->", details);
    return api.post("/projects", { details });
  } catch (err) {
    console.log("error in project post:->", err);
    throw err;
  }
};

const fetchProjectDetails = async (id) => {
  try {
    console.log("id of project fetch in api call->", id);
    return api.get(`/projects/${id}`);
  } catch (err) {
    console.log("error in projects fetch:->", err);
  }
};

export async function getMyProjects() {
  try {
    return api.get(`/projects2/my`);
  } catch (err) {
    console.log("error in projects fetch:->", err);
  }
}

export async function getAssignedProjects() {
  try {
    return api.get(`/projects2/assigned`);
  } catch (err) {
    console.log("error in projects fetch:->", err);
  }
}

export async function bid({
  bidAmount,
  deliveryTime,
  proposal,
  milestoneDetails,
  id,
}) {
  try {
    return api.post(`/projects/${id}/bid`, {
      bidAmount,
      deliveryTime,
      proposal,
      milestoneDetails,
    });
  } catch (err) {
    console.log("error in projects fetch:->", err);
  }
}

export async function getBids() {
  try {
    return api.get(`/projects2/bids`);
  } catch (err) {
    console.log("error in projects fetch:->", err);
  }
}

export async function assignProject(projectId, freelancerId) {
  return api
    .post(`/projects/assign-project`, { projectId, freelancerId })
    .then((res) => {
      console.log("project assigned successfully");
      return res;
    })
    .catch((err) => {
      console.log("error in assigning project:->", err);
      throw err;
    });
}

export { fetchProjects, fetchProjectDetails, postProject };
