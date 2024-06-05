import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  AllEvents: [],
};

const EventSlice = createSlice({
  name: "event",
  initialState: initialState,
  reducers: {},
});

// export const { getEvents, deleteEvent, updateEvent, addEvent } =
//   EventSlice.actions;

export default EventSlice.reducer;
