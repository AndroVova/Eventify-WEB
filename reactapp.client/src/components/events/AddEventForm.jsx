import React, { useState } from "react";

import Input from "../utils/Input/Input";
import Map from "../map/Map";
import { fetchPostEvent } from "../../clients/response";
import styles from "./AddEventForm.module.css";
import { useSelector } from "react-redux";

const AddEventForm = ({ onSubmit }) => {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.tokenValue.token);
  
    const [form, setForm] = useState({
      name: "",
      description: "",
      type: 0,
      userId: user.id,
      imgUpload: null,
      ageLimit: 0,
      date: "",
      link: "",
      locations: [{ pointX: 0, pointY: 0 }]
    });
    const [error, setError] = useState("");
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleImageChange = (e) => {
      setForm((prevState) => ({
        ...prevState,
        imgUpload: e.target.files[0],
      }));
    };
  
    const handleMapClick = (position) => {
        if (position && position.latLng) {
          const lat = position.latLng.lat();
          const lng = position.latLng.lng();
          setForm((prevState) => ({
            ...prevState,
            locations: [{ pointX: lng, pointY: lat }],
          }));
        }
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      for (let key in form) {
        if (key === "imgUpload") {
          formData.append(key, form[key]);
        } else if (key === "locations") {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      }
  
      const config = {
        body: formData,
        headers: {},
      };
  
      try {
        const response = await fetchPostEvent(
          "https://eventify-backend.azurewebsites.net/api/Event/create-events",
          token,
          config
        );
        if (!response.isError) {
          onSubmit(response.data); // Передаем новые данные в родительский компонент
        } else {
          setError("Failed to add event. Please try again.");
        }
      } catch (error) {
        console.error("Error adding event:", error);
        setError("Failed to add event. Please try again.");
      }
    };
  
    return (
      <form className={styles.addEventForm} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}
        <Input
          label="Event Name"
          id="name"
          className={styles.input}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Event Name"
          required
        />
        <label>
          Event Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <Input
          label="Event Type"
          id="type"
          type="number"
          className={styles.input}
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Event Type"
          required
        />
        <Input
          label="Event Image"
          id="imgUpload"
          type="file"
          className={styles.input}
          name="imgUpload"
          onChange={handleImageChange}
          required
        />
        <Input
          label="Age Limit"
          id="ageLimit"
          type="number"
          className={styles.input}
          name="ageLimit"
          value={form.ageLimit}
          onChange={handleChange}
          placeholder="Age Limit"
          required
        />
        <Input
          label="Event Date and Time"
          id="date"
          type="datetime-local"
          className={styles.input}
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Event Date and Time"
          required
        />
        <Input
          label="Event Link"
          id="link"
          className={styles.input}
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Event Link"
          required
        />
        <label>
          Event Location
          <div className={styles.mapContainer}>
            <Map 
              markersData={[]} 
              onMarkerPositionChange={handleMapClick}
            />
          </div>
        </label>
        <button type="submit">Add Event</button>
      </form>
    );
  };

export default AddEventForm;
