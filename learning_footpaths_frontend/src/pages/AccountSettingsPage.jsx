// export default function AccountSettingsPage() {
//   return <div>HUH Account Settings Page</div>;
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/accountsettings_page/AccountSettingsPage.module.css";

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    grade_level: "",
  });
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8888/api/account/profile",
        {
          withCredentials: true,
        }
      );
      setFormData({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        grade_level: response.data.grade_level || "",
      });
      if (response.data.profile_photo) {
        setPreviewUrl(
          `http://localhost:8888/static/profile_photos/${response.data.profile_photo}`
        );
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update profile information
      await axios.put("http://localhost:8888/api/account/profile", formData, {
        withCredentials: true,
      });

      // If there's a new photo, upload it
      if (photo) {
        const photoData = new FormData();
        photoData.append("photo", photo);
        await axios.post(
          "http://localhost:8888/api/account/profile-photo",
          photoData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      navigate("/account");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.settingsContainer}>
      <Header />
      <div className={styles.contentWrapper}>
        <h2>Account Settings</h2>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.photoSection}>
            <img
              src={previewUrl || "/api/placeholder/150/150"}
              alt="Profile"
              className={styles.profilePhoto}
            />
            <div className={styles.photoUpload}>
              <label htmlFor="photo" className={styles.photoButton}>
                Change Photo
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className={styles.hiddenInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="grade_level">Grade Level</label>
            <select
              id="grade_level"
              name="grade_level"
              value={formData.grade_level}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">Select Grade Level</option>
              <option value="K">Kindergarten</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/account")}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
