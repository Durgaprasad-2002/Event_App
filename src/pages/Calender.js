import React, { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import CalendarDays from "./CalenderDays";
import logo from "../Images/logo.png";
import "./index.css";

export default function Calender() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const changeMonth = (increment) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  const changeCurrentDay = (day) => {
    setCurrentDate(new Date(day.year, day.month, day.number));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <>
      <div className="Calender-Navigation-bar">
        <div className="Title">
          <img alt="LOGO" src={logo} className="logo" />
        </div>
        <div className="ToggelBTNS">
          <button className="NavBTNS" onClick={() => changeMonth(-1)}>
            <BsChevronLeft className="icon" />
          </button>
          <h3 className="Month">{months[currentDate.getMonth()]},</h3>{" "}
          <h3 className="Year">{currentDate.getFullYear()}</h3>
          <button className="NavBTNS" onClick={() => changeMonth(1)}>
            <BsChevronRight className="icon" />
          </button>
          <button class="button-17" role="button" onClick={goToToday}>
            Today
          </button>
        </div>
      </div>
      <div className="calender">
        <div className="weeks">
          {weekdays.map((week, index) => (
            <div key={index} className="week">
              {week}
            </div>
          ))}
        </div>
        <CalendarDays day={currentDate} changeCurrentDay={changeCurrentDay} />
      </div>
    </>
  );
}
