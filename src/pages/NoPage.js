import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoPage() {
  let navigate = useNavigate();
  return (
    <div className="outer-no-event2">
      <div className="Text_Noevent">
        <div className="NOTFOUND">
          <h2>
            Oop's <b className="error">404</b>
          </h2>
          <img
            className="no-img"
            src="https://cdni.iconscout.com/illustration/premium/thumb/not-found-4064375-3363936.png?f=webp"
          />
        </div>

        <p>The Page you are looking for is not found, navigate to home page</p>

        <button className="no-event-btn" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
}
