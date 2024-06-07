import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.user = action.payload;
    }
  },
});

export const {
  setName,
} = userSlice.actions;

export const selectName = (state) => state.user.user;

export default userSlice.reducer;