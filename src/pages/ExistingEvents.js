import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { months } from "./Data";
import Loader from "./Loader";
import axios from "axios";
import noevent from "../Images/no-event-bg.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ExistingEvents() {
  const location = useLocation();
  const navigate = useNavigate();

  const [Loading, setLoading] = useState(true);
  const [dataModified, setModified] = useState(false);
  const [Events, setEvents] = useState([]);

  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const Token = useMemo(
    () => JSON.parse(localStorage.getItem("googleTokens")),
    []
  );

  const isAccessTokenExpired = useCallback(
    (expiry_date) => Date.now() > parseInt(expiry_date),
    []
  );

  useEffect(() => {
    if (!user?.googleId || isAccessTokenExpired(user.expiry_date)) {
      localStorage.clear();
      navigate("/login");
    }
  }, [user]);

  const handleEditEvent = useCallback(
    (event) => {
      navigate("/updateEvent", {
        state: {
          event: {
            id: event._id,
            title: event.title,
            description: event.description,
            participants: event.participants,
            startTime: event.startTime,
            endTime: event.endTime,
            date: event.date,
          },
          Date: location.state,
        },
      });
    },
    [navigate, location.state]
  );

  const DeleteEvent = useCallback(
    (ele) => {
      const access_token = Token.access_token;
      axios
        .delete(
          `https://event-server-dp.onrender.com/api/events/?id=${ele}&googleToken=${access_token}`
        )
        .then(() => {
          toast(`${ele} Id Event is Deleted`);
          FETCHEvents();
        })
        .catch((err) => {
          toast(`Failed to Remove, ${err.message}`);
          console.log(err);
        });
    },
    [Token]
  );

  const padToTwoDigits = useCallback(
    (number) => number.toString().padStart(2, "0"),
    []
  );

  const FETCHEvents = useCallback(() => {
    const month = padToTwoDigits(location.state?.month + 1);
    const day = padToTwoDigits(location.state?.number);
    const year = location.state?.year;
    const full = `${year}-${month}-${day}`;

    axios
      .get(
        `https://event-server-dp.onrender.com/api/events?id=${user?.googleId}&date=${full}`
      )
      .then((data) => {
        setEvents([...data.data]);
        setModified(false);
      })
      .catch((err) => {
        console.log(err);
        toast(err.message);
      })
      .finally(() => setLoading(false));
  }, [location.state, user]);

  useEffect(() => {
    FETCHEvents();
  }, []);

  const getEventStatus = useCallback((startTime, endTime) => {
    const now = new Date().toISOString();

    if (now < startTime) return "Needs to Complete";
    if (now >= startTime && now <= endTime) return "In Progress";
    if (now > endTime) return "Completed";
  }, []);

  let MainCon = (
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
      <div className="Calender-Event-bar">
        <div>
          <span>Event's day</span>
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
      <>
        {Events.length === 0 ? (
          <div className="outer-no-event">
            <img src={noevent} className="no-event" alt="No event" />
          </div>
        ) : (
          <div className="Events-container">
            {Events.map((event) => {
              const status = getEventStatus(
                new Date(
                  `${event.date.split("T")[0]}T${event.startTime}`
                ).toISOString(),
                new Date(
                  `${event.date.split("T")[0]}T${event.endTime}`
                ).toISOString()
              );

              const disableActions =
                status === "Completed" || status === "In Progress";
              return (
                <div key={event._id} className="Event-card">
                  <h3 className="title-name Event-title">
                    {event.title.toUpperCase()}
                  </h3>

                  <div className="bottem-event">
                    <div className="Main-content">
                      <div className="bottem-event-contents">
                        <p className="Event-description">{event.description}</p>
                        <p>
                          <strong>Event Time :</strong>{" "}
                          <span>{event.startTime}</span>
                          <FaArrowsAltH />
                          <span>{event.endTime}</span>
                        </p>
                        <p>
                          <strong>Event Status :</strong> <span>{status}</span>
                        </p>
                        <p>
                          <strong>Event Id :</strong>{" "}
                          <span className="text-small">{event._id}</span>
                        </p>
                      </div>

                      <div className="button-container">
                        <button
                          className={`btn delete-btn ${
                            disableActions ? "disabled" : ""
                          }`}
                          onClick={() =>
                            !disableActions && DeleteEvent(event._id)
                          }
                          disabled={disableActions}
                        >
                          Delete
                        </button>
                        <button
                          className={`btn update-btn ${
                            disableActions ? "disabled" : ""
                          }`}
                          onClick={() =>
                            !disableActions && handleEditEvent(event)
                          }
                          disabled={disableActions}
                        >
                          Update
                        </button>
                      </div>
                    </div>

                    <div className="participant-holder">
                      {event.participants.map((part) => (
                        <button key={part} className="part-item-btn1">
                          {part}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>

      <button
        className="Create-BTN"
        onClick={() => {
          navigate("/CreateEvent", { state: location.state });
        }}
        title="Create Event"
      >
        <BiPlus />
      </button>
      <div className="footer">
        <p>EVENT ORGANIZER © 2024</p>
      </div>
    </>
  );

  return <>{Loading ? <Loader /> : MainCon}</>;
}
