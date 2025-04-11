import { api } from "./axiosConfig";

// export const getMessages = async (currentUserId, receiverId) => {
//   try {
//     console.log("filters in api call->", filters);
//     return api.get(`/messages/${currentUserId}/${receiverId}`);
//   } catch (err) {
//     console.log("error in projects fetch:->", err);
//     throw err;
//   }
// };

export const getMessages = async (currentUserId, receiverId) => {
  console.log("getting messages for: ", user, " from ", otherUser);
  return api
    .get(`/messages/${currentUserId}/${receiverId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const startConversation = async (user1, user2) => {
  console.log("starting conversation between: ", user1, " and ", user2);
  return api
    .post("/messages/start", { senderId: user1, receiverId: user2 })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
