import { configureStore } from "@reduxjs/toolkit";
import EventReducer from "./slices/Events";

export const store = configureStore({
  reducer: {
    Event: EventReducer,
  },
});
