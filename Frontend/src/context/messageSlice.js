import { configureStore, createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    contacts: [],
    currentChatUser: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    setCurrentChatUser: (state, action) => {
      state.currentChatUser = action.payload;
    },
  },
});

export const { addMessage, setMessages, setContacts, setCurrentChatUser } =
  chatSlice.actions;
// export const store = configureStore({ reducer: { chat: chatSlice.reducer } });
export default chatSlice.reducer;