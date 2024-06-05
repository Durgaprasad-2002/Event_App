import React, { useState, useEffect } from "react";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";
import SelectButton from "./SelectButton";
import { months, times } from "./Data";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventUpdate() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [Times, setTimes] = useState({
    startTime: location.state.event.startTime || "",
    endTime: location.state.event.endTime || "",
    dateOBJ: location.state.event.date || "",
    event: location.state.event || "",
  });

  const [partMail, setPartmail] = useState("");
  const [ADDParticipants, setADD] = useState(
    location.state.event.participants || []
  );
  console.log(location.state);

  const ConvertTo12hr = (Eventtime) => {
    const timeArray = Eventtime.split(":");
    let period = "";
    let time = Number(timeArray[0]);
    if (time > 11 && time <= 23) {
      time -= 12;
      period = "PM";
    } else if (time == 24) {
      time -= 12;
      period = "AM";
    } else period = "AM";
    return `${time.toString().padStart(2, "0")}:00 ${period}`;
  };

  const [updatedEvent, setUpdatedEvent] = useState({
    title: location.state.event.title || "",
    description: location.state.event.description || "",
    date: "",
    startTime: ConvertTo12hr(location.state.event.startTime),
    endTime: ConvertTo12hr(location.state.event.endTime),
    duration: location.state.event.duration || 1,
    participants: location.state.event.participants || "",
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

  // Functions to Handle Participants ------------------------------------------

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

  const handleChange = (e) => {
    setUpdatedEvent({
      ...updatedEvent,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle Submit----------------------------------------------------

  function padToTwoDigits(number) {
    return number.toString().padStart(2, "0");
  }

  const handleEventSubmit = (e) => {
    e.preventDefault();

    const month = padToTwoDigits(location.state?.Date?.month + 1);
    const day = padToTwoDigits(location.state?.Date?.number);
    const year = location.state?.Date?.year;

    console.log(`${year}-${month}-${day}`);

    let user = JSON.parse(localStorage.getItem("user"));
    const Token = JSON.parse(localStorage.getItem("googleTokens"));

    const eventData = {
      title: updatedEvent.title,
      description: updatedEvent.description,
      participants: ADDParticipants,
      date: `${year}-${month}-${day}`,
      startTime: updatedEvent.startTime,
      endTime: updatedEvent.endTime,
      sessionNotes: "",
      userId: user.googleId,
      googleToken: Token.access_token,
    };

    console.log(eventData.date);

    setLoading(true);

    console.log("event dtaa:" + eventData);

    axios
      .put(
        `https://event-server-dp.onrender.com/api/events/${location.state.event.id}`,
        eventData
      )
      .then((response) => {
        setEvents([...events, response.data]);
        toast("Event is Updated, Redirecting to Home");
        setTimeout(() => navigate("/"), 5000);
      })
      .catch((err) => {
        toast("Failed to Update Event," + err?.response?.data?.error);
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
        rtl
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <div>
        <div className="Calender-Event-bar">
          <div>
            <span>Update event on</span>
            <h3>
              {location.state?.Date?.number}{" "}
              {months[location.state?.Date?.month]},{" "}
              {location.state?.Date?.year}
            </h3>
          </div>
          <button className="button-17" onClick={() => navigate("/", {})}>
            Home
          </button>
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
              value={updatedEvent.title}
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
              value={updatedEvent.description}
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
                Handle={handleChange}
                name="startTime"
                value={updatedEvent.startTime}
              />
            </div>
            <div className="select-item">
              <h4 className="event-form-label">End Time</h4>
              <SelectButton
                data={filterEndTimes(updatedEvent.startTime)}
                Handle={handleChange}
                name="endTime"
                value={updatedEvent.endTime}
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
              {loading ? "Updating..." : "Update Event"}
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
