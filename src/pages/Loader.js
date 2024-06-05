import React from "react";
import "./index.css";

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div class="Loader_ANI" style={{ zIndex: "100" }}></div>
    </div>
  );
}
