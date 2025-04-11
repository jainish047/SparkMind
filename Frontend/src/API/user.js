import { api } from "./axiosConfig";

// basic details
const getSelfDetails = async () => {
  return await api
    .get("/user/self")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

const getUserDetails = async (id) => {
  return await api
    .get(`/user/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export { getSelfDetails, getUserDetails };
