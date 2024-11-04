import React from "react";

export default function CustomBadgeIcon() {
  return (
    <div>
      <div
        style={{
          width: "100px",
          height: "100px",
          border: "1px solid black",
          borderRadius: "50%",
        }}
      ></div>
      <button style={{ display: "block", marginTop: "10px" }}>
        Upload Badge
      </button>
      <a href="#" style={{ display: "block", marginTop: "10px" }}>
        Grab Template here
      </a>
    </div>
  );
}
