import React from "react";
import { useNavigate } from "react-router-dom";

function CalendarDays({ day }) {
  const navigate = useNavigate();

  const firstDayOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
  const weekdayOfFirstDay = (firstDayOfMonth.getDay() + 6) % 7;
  const currentDays = [];
  const today = new Date();

  function AddDays() {
    for (let i = 0; i < 42; i++) {
      if (i === 0) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() - weekdayOfFirstDay);
      } else {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
      }

      const calendarDay = {
        currentMonth: firstDayOfMonth.getMonth() === day.getMonth(),
        date: new Date(firstDayOfMonth),
        month: firstDayOfMonth.getMonth(),
        number: firstDayOfMonth.getDate(),
        isToday: firstDayOfMonth.toDateString() === today.toDateString(),
        year: firstDayOfMonth.getFullYear(),
        isweekday:
          firstDayOfMonth.getDay() == 0 || firstDayOfMonth.getDay() == 6,
      };

      currentDays.push(calendarDay);
    }
  }

  AddDays();

  function CreateEvent(dateinfo) {
    navigate("/Events", { state: dateinfo });
  }

  return (
    <div className="days">
      {currentDays.map((dayItem, index) => (
        <div
          key={index}
          className={`day 
          ${dayItem.currentMonth ? "current" : ""} 
          ${dayItem.selected ? "selected" : ""} 
          ${dayItem.isToday ? "today" : ""} 
          ${dayItem.isweekday && dayItem.currentMonth ? "weekday" : ""}
          ${!dayItem.currentMonth ? "Not-This-Month" : ""}
          `}
          onClick={() => CreateEvent(dayItem)}
        >
          <p>{dayItem.number}</p>
        </div>
      ))}
    </div>
  );
}

export default CalendarDays;
