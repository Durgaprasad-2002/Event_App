import React, { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
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
          <div className="ToggelBTNS">
            <div className="togglebtnsConatiner">
              <button className="NavBTNS" onClick={() => changeMonth(-1)}>
                <MdArrowLeft className="icon" />
              </button>
              <button className="NavBTNS" onClick={() => changeMonth(1)}>
                <MdArrowRight className="icon" />
              </button>
            </div>
            <h3 className="Month">
              {months[currentDate.getMonth()]},{" "}
              <span className="Year">{currentDate.getFullYear()}</span>
            </h3>{" "}
          </div>
        </div>

        <button className="button-17" role="button" onClick={goToToday}>
          Today
        </button>
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
