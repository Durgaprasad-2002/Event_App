import "./App.css";
import Calender from "./pages/Calender";
import EventCreation from "./pages/EventCreation";
import EventUpdate from "./pages/EventUpdate";
import ExistingEvents from "./pages/ExistingEvents";
import GoogleLogin from "./pages/GoogleLogin";
import NoPage from "./pages/NoPage";
import { store } from "./Redux/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Calender />} />
            <Route path="login" element={<GoogleLogin />} />
            <Route path="Events" element={<ExistingEvents />} />
            <Route path="CreateEvent" element={<EventCreation />} />
            <Route path="updateEvent" element={<EventUpdate />} />
            {/* <Route path="Loader" element={<Loader />} /> */}
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
