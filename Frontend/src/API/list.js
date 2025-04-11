import { api } from "./axiosConfig";

// basic details
export const fetchLists = async (name) => {
  try {
    return api.get(`/lists`);
  } catch (err) {
    throw err;
  }
};

export const fetchItems = async (listId) => {
  try {
    return api.get(`/lists/${listId}`);
  } catch (err) {
    throw err;
  }
};

export const createNewList = async (name, type) => {
  try {
    console.log("sending post req to create list ", name, "of type ", type)
    return api.post(`/lists/create`, { name, type });
  } catch (err) {
    throw err;
  }
};

export const addToList = async (listId, type, entityId) => {
  try {
    return api.post(`/lists/add`, { listId, type, entityId });
  } catch (err) {
    throw err;
  }
};

export const removeItemFromList = async (listId, entityId) => {
  try {
    return api.delete(`/lists/${listId}/${entityId}`);
  } catch (err) {
    throw err;
  }
};

export const deleteList = async (listId) => {
  try {
    return api.delete(`/lists/${listId}`);
  } catch (err) {
    throw err;
  }
};
