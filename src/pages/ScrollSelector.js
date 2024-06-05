import React, { useRef, useState, useEffect } from "react";
import "./index.css";
import { times } from "./Data";

export default function ScrollSelector() {
  const selector = useRef(null);
  let [selected, setselected] = useState(false);
  const [top, setTop] = useState(100);
  const [height, setHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      highlightElementsAtPosition(top, top + height);
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        if (isTop) {
          const newTop = e.clientY;
          const newHeight = height + (top - newTop);
          if (newHeight >= 50) {
            // Minimum height
            setTop(newTop);
            setHeight(newHeight);
          }
        } else {
          console.log("scroll Height" + document.documentElement.scrollTop);
          console.log(e.clientY);
          const newHeight = e.clientY + top;
          if (newHeight >= 50) {
            // Minimum height
            setHeight(newHeight);
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isTop, top, height]);

  const handleMouseDown = (topResizer) => {
    setIsDragging(true);
    setIsTop(topResizer);
  };

  const highlightElementsAtPosition = (topPosition, bottomPosition) => {
    // Remove previous highlights
    document
      .querySelectorAll(".highlight")
      .forEach((el) => el.classList.remove("highlight"));

    // Get and highlight top element
    const topElement = document.elementFromPoint(
      window.innerWidth / 4,
      topPosition
    );
    if (topElement && topElement.classList.contains("Time")) {
      topElement.classList.add("highlight");
    }

    // Get and highlight bottom element
    const bottomElement = document.elementFromPoint(
      window.innerWidth / 4,
      bottomPosition
    );
    if (bottomElement && bottomElement.classList.contains("Time")) {
      bottomElement.classList.add("highlight");
    }
  };

  return (
    <>
      <div className="SelectorContainer">
        <div className="SlectorTimesContainer">
          {times.map((time) => (
            <article className="time-holder">{time}</article>
          ))}
        </div>
        <div className="TimeSelectorContainer">
          <div
            className="TimeSelector"
            style={{ position: "relative", top, height }}
            ref={selector}
            id="selector"
          >
            <div
              className="resizer resizer-up"
              onMouseDown={() => handleMouseDown(true)}
            ></div>
            <div
              className="resizer resizer-down"
              onMouseDown={() => handleMouseDown(false)}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
