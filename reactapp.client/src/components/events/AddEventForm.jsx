import React, { useEffect, useState } from "react";

import EventTypes from "../../models/EventTypes"; // Импортируем EventTypes
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
    locations: [{ pointX: 0, pointY: 0 }],
    tags: [],
  });
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "https://eventify-backend.azurewebsites.net/api/Tag/get-all"
        );
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

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
    if (position) {
      const lat = position.lat;
      const lng = position.lng;
      setForm((prevState) => ({
        ...prevState,
        locations: [{ pointX: lng, pointY: lat }],
      }));
    }
  };

  const handleAddTag = (e) => {
    const selectedTagId = e.target.value;
    const selectedTag = tags.find((tag) => tag.id === selectedTagId);
    if (selectedTag && !form.tags.some((tag) => tag.id === selectedTagId)) {
      setForm((prevState) => ({
        ...prevState,
        tags: [
          ...prevState.tags,
          {
            id: selectedTag.id,
            name: selectedTag.name,
            color: selectedTag.color,
          },
        ],
      }));
    }
  };

  const handleRemoveTag = (tagId) => {
    setForm((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag.id !== tagId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Проверяем, что все поля заполнены
    if (
      !form.name ||
      !form.description ||
      form.type === 0 ||
      !form.imgUpload ||
      form.ageLimit === 0 ||
      !form.date ||
      !form.link ||
      form.locations[0].pointX === 0 ||
      form.locations[0].pointY === 0
    ) {
      setError("Please fill out all fields and select a location on the map.");
      return;
    }
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("userId", form.userId);
    formData.append("imgUpload", form.imgUpload);
    formData.append("ageLimit", form.ageLimit);
    formData.append("date", form.date);
    formData.append("link", form.link);

    formData.append("locations[0].pointX", form.locations[0].pointX);
    formData.append("locations[0].pointY", form.locations[0].pointY);

    form.tags.forEach((tag, index) => {
      formData.append(`tags[${index}].id`, tag.id);
      formData.append(`tags[${index}].name`, tag.name);
      formData.append(`tags[${index}].color`, tag.color);
    });

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
        onSubmit(response.data);
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
      <label>
        Event Type
        <select
          id="type"
          className={styles.input}
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value={0} disabled>
            Select Event Type
          </option>
          {Object.keys(EventTypes).map((key) => (
            <option key={EventTypes[key]} value={EventTypes[key]}>
              {key}
            </option>
          ))}
        </select>
      </label>
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
        Event Tags
        <div className={styles.preferencesContainer}>
          {form.tags.map((tag) => {
            const tagDetails = tags.find((t) => t.id === tag.id);
            return (
              <div key={tag.id} className={styles.preferenceItem}>
                {tagDetails.name}
                <button type="button" onClick={() => handleRemoveTag(tag.id)}>
                  x
                </button>
              </div>
            );
          })}
        </div>
        <select className={styles.selectField} onChange={handleAddTag} value="">
          <option value="" disabled>
            Select Tag
          </option>
          {tags
            .filter((tag) => !form.tags.some((t) => t.id === tag.id))
            .map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Event Location
        <div className={styles.mapContainer}>
          <Map markersData={[]} onMarkerPositionChange={handleMapClick} />
        </div>
      </label>
      <button type="submit">Add Event</button>
    </form>
  );
};

export default AddEventForm;
