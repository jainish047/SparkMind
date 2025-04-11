import { api } from "./axiosConfig";

const fetchFreelancers = async (filters) => {
  try {
    console.log("filters in api call->", filters);
    return api.get("/freelancers", { params: filters });
    // in backend: body.filters.status
  } catch (err) {
    console.log("error in projects fetch:->", err);
  }
};

export { fetchFreelancers };
