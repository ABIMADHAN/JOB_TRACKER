import { createSlice } from "@reduxjs/toolkit";
let init = JSON.parse(localStorage.getItem("job")) || [];

const Createslice = createSlice({
  name: "job",
  initialState: init,
  reducers: {
    addjob(state, action) {
      const exists = state.some((job) => job.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
        localStorage.setItem("job", JSON.stringify(state));
      }
    },

    jobdelete(state, action) {
      const newState = state.filter((job) => job.id !== action.payload);
      localStorage.setItem("job", JSON.stringify(newState));
      return newState;
    },
  },
});
export default Createslice.reducer;
export const { addjob, jobdelete } = Createslice.actions;
