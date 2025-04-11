import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToList, createNewList, fetchItems, fetchLists } from "../API/list";
import { setLoadingState } from "./loadingSlice";

const initialState = {
  lists: [],
  selectedList: {id:"bookmark", name:"Bookmark", type:"PROJECT"},
  items: [],
  message:""
};

export const getLists = createAsyncThunk(
  "lists/getLists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchLists();
      console.log("lists->", response.data.lists);
      return response.data.lists;
    } catch (err) {
      return rejectWithValue({
        message: err.message || "lists fetching failed",
        status: err.status || 500,
      });
    }
  }
);

export const getItems = createAsyncThunk(
    "lists/getItems",
    async (_, { getState, rejectWithValue }) => {
      try {
        const response = await fetchItems(getState().lists.selectedList?.id || null);
        console.log("items->", response.data);
        return response.data;
      } catch (err) {
        return rejectWithValue({
          message: err.message || "items fetching failed",
          status: err.status || 500,
        });
      }
    }
  );

export const createList = createAsyncThunk(
  "lists/createList",
  async ({ newListName, type }, { rejectWithValue }) => {
    try {
      const response = await createNewList(newListName, type);
      console.log("lists->", response.data.lists);
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.message || "list create failed",
        status: err.status || 500,
      });
    }
  }
);

// export const addItemToList = createAsyncThunk(
//   "lists/addToList",
//   async ({ listId, type, entityId }, { rejectWithValue }) => {
//     try {
//       const response = await addToList(listId, type, entityId);
//       console.log("items->", response.data.items);
//       return response.data.items;
//     } catch (err) {
//       return rejectWithValue({
//         message: err.message || "item add failed",
//         status: err.status || 500,
//       });
//     }
//   }
// );

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setSelectedList:(state, action)=>{
        state.selectedList = action.payload || "follow"
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLists.pending, (state) => {
        setLoadingState({ actionName: "lists", isLoading: true });
      })
      .addCase(getLists.fulfilled, (state, action) => {
        setLoadingState({ actionName: "lists", isLoading: false });
        state.lists = action.payload;
        state.message = action.payload.message;
      })
      .addCase(getLists.rejected, (state, action) => {
        setLoadingState({ actionName: "lists", isLoading: false });
        console.error("lists fetch failed:", action.payload);
        state.message = action.payload.message;
      })
      .addCase(getItems.pending, (state) => {
        setLoadingState({ actionName: "listItems", isLoading: true });
      })
      .addCase(getItems.fulfilled, (state, action) => {
        setLoadingState({ actionName: "listItems", isLoading: false });
        state.items = action.payload.items || [];
        state.message = action.payload.message;
      })
      .addCase(getItems.rejected, (state, action) => {
        setLoadingState({ actionName: "listItems", isLoading: false });
        console.error("list items fetch failed:", action.payload);
        state.message = action.payload.message;
      })
      .addCase(createList.pending, (state) => {
        setLoadingState({ actionName: "newList", isLoading: true });
      })
      .addCase(createList.fulfilled, (state, action) => {
        setLoadingState({ actionName: "newList", isLoading: false });
        state.lists = action.payload.lists;
        console.log("lists in reducer: ", state.lists)
        state.message = action.payload.message;
      })
      .addCase(createList.rejected, (state, action) => {
        setLoadingState({ actionName: "newList", isLoading: false });
        console.error("list create failed:", action.payload);
        state.message = action.payload.message;
      });
      // .addCase(addItemToList.pending, (state) => {
      //   setLoadingState({ actionName: "addToList", isLoading: true });
      // })
      // .addCase(addItemToList.fulfilled, (state, action) => {
      //   setLoadingState({ actionName: "addToList", isLoading: false });
      //   state.items = action.payload;
      // })
      // .addCase(addItemToList.rejected, (state, action) => {
      //   setLoadingState({ actionName: "addToList", isLoading: false });
      //   console.error("Skills fetch failed:", action.payload);
      // });
  },
});

export const { setSelectedList } = listsSlice.actions;

export default listsSlice.reducer;
