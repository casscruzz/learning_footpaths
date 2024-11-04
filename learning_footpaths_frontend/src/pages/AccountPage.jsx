import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function AccountPage() {
  return (
    <>
      <Header />
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div>
          <img
            src="path_to_photo.jpg"
            alt="User Photo"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
          <div>
            <Link to="/edit-photo">Edit Photo</Link>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2>First N. Last Name</h2>
          <p>Grade Level</p>
          <button>Edit Information</button>
        </div>
        <div style={{ marginTop: "20px" }}>
          <button>My Badges</button>
          <button>Create Custom Badge</button>
          <button>Account Settings</button>
        </div>
      </div>
    </>
  );
}
