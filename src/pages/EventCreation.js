import React, { useState, useEffect } from "react";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";
import SelectButton from "./SelectButton";
import { months, times } from "./Data";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventCreation() {
  const location = useLocation();
  const navigate = useNavigate();

  let [loading, setLoading] = useState(false);
  let [events, setEvents] = useState([]);

  const [Times, setTimes] = useState({
    startTime: "",
    endTime: "",
    dateOBJ: location.state,
    event: "",
  });

  const [partMail, setPartmail] = useState("");

  let [ADDParticipants, setADD] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    duration: 1,
    participants: "",
  });

  // Verifying User is Defined------------------------------------

  useEffect(() => {
    if (localStorage.getItem("user") == null) {
      navigate("/login");
    }
  }, []);

  // -------------------------------------------------------------------------------------------------

  const filterEndTimes = (startTime) => {
    if (!startTime) return times;
    const startIndex = times.indexOf(startTime);
    return times.slice(startIndex + 1);
  };

  //Functions to Handle Participants------------------------------------------

  const HandlePartMail = (e) => {
    setPartmail(e.target.value);
  };

  const HandleParticipants = (e) => {
    setADD((ADDParticipants) => [...ADDParticipants, partMail]);
    document.getElementsByName("partMail")[0].value = "";
  };

  function removeElementByIndex(array, index) {
    if (index >= 0 && index < array.length) {
      array.splice(index, 1);
    }
    return array;
  }

  const removeParticipant = (ind) => {
    let newELE = removeElementByIndex(ADDParticipants, ind);
    setADD([...newELE]);
  };

  // functions to Handle SelectButton Componenst -------------------------------------------------------------

  function HandleInputs(e) {
    const { name, value } = e.target;

    setTimes((prevTimes) => ({
      ...prevTimes,
      [name]: value,
    }));
  }

  const handleChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle Submit----------------------------------------------------

  function padToTwoDigits(number) {
    return number.toString().padStart(2, "0");
  }

  const handleEventSubmit = (e) => {
    e.preventDefault();

    const month = padToTwoDigits(location.state?.month + 1);
    const day = padToTwoDigits(location.state?.number);
    const year = location.state?.year;

    let user = JSON.parse(localStorage.getItem("user"));
    const Token = JSON.parse(localStorage.getItem("googleTokens"));

    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      participants: ADDParticipants,
      date: `${year}-${month}-${day}`,
      time: Times.startTime,
      endTime: Times.endTime,
      sessionNotes: "",
      userId: user.googleId,
      googleToken: Token.access_token,
    };

    setLoading(true);

    axios
      .post("https://event-server-dp.onrender.com/api/events", eventData)
      .then((response) => {
        setEvents([...events, response.data]);
        console.log(response.data);
        toast("Event is Created, Redirecting to Home");
        setTimeout(() => navigate("/"), 5000);
      })
      .catch((err) => {
        toast("Failed to Create Event," + err?.response?.data?.error);
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <div>
        <div className="Calender-Event-bar">
          <div>
            <span>Create new event on</span>
            <h3>
              {location.state?.number} {months[location.state?.month]},{" "}
              {location.state?.year}
            </h3>
          </div>
          <div className="logout-container">
            <button className="button-17" onClick={() => navigate("/", {})}>
              Home
            </button>
            <button
              className="button-17"
              onClick={() => {
                localStorage.clear();
                navigate("/login", {});
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div>
        <form onSubmit={handleEventSubmit}>
          <h4 className="event-form-label">Enter the Event name</h4>
          <div className="input-container col-md-3">
            <input
              placeholder="title"
              className="input-field"
              type="text"
              required
              name="title"
              onChange={handleChange}
            />
            <label htmlFor="input-field" className="input-label">
              Email
            </label>
            <span className="input-highlight"></span>
          </div>

          {/*  */}
          <h4 className="event-form-label">Description</h4>
          <div className="input-container col-md-3">
            <input
              placeholder="desc.."
              className="input-field"
              type="text"
              required
              name="description"
              onChange={handleChange}
            />
            <label htmlFor="input-field" className="input-label">
              Email
            </label>
            <span className="input-highlight"></span>
          </div>
          {/*  */}
          <div className="select-container">
            <div className="select-item">
              <h4 className="event-form-label">Start Time</h4>
              <SelectButton
                data={times}
                Handle={HandleInputs}
                name="startTime"
              />
            </div>
            <div className="select-item">
              <h4 className="event-form-label">End Time</h4>
              <SelectButton
                data={filterEndTimes(Times.startTime)}
                Handle={HandleInputs}
                name="endTime"
              />
            </div>
          </div>
          <h4 className="event-form-label">Enter Participants Mail</h4>
          <div className="input-container col-md-3">
            <input
              placeholder="email"
              className="input-field"
              type="email"
              name="partMail"
              onChange={HandlePartMail}
            />
            <label htmlFor="input-field" className="input-label">
              email
            </label>
            <span className="input-highlight"></span>
          </div>
          <div className="outer-Submit">
            <button
              onClick={HandleParticipants}
              type="button"
              className="button-18"
            >
              add
            </button>
          </div>
          <div className="Container-participants">
            {ADDParticipants.length == 0
              ? "No Participants were added"
              : ADDParticipants.map((ele, ind) => {
                  return (
                    <button
                      className="part-item-btn"
                      type="button"
                      onClick={() => removeParticipant(ind)}
                    >
                      <span className="part-item">
                        {ele} <b>✕</b>
                      </span>
                    </button>
                  );
                })}
          </div>
          <div className="outer-Submit">
            <button type={loading ? "button" : "submit"} className="button-18">
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
        <br />
      </div>
      <div className="footer">
        <p>DURGA PRASAD © 2024</p>
      </div>
    </>
  );
}
