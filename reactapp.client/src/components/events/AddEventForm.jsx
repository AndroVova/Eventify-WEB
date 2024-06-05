import React, { useState } from "react";

import CustomSelect from "../utils/CustomSelect/CustomSelect";
import EventTags from "./EventTags";
import EventTypes from "../../models/EventTypes";
import ImageUploader from "./ImageUploader";
import Input from "../utils/Input/Input";
import MapSelector from "./MapSelector";
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
  const isEditing = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    console.log(selectedOption, actionMeta);
    setForm((prevState) => ({
      ...prevState,
      type: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleImageChange = (blob) => {
    setForm((prevState) => ({
      ...prevState,
      imgUpload: blob,
    }));
  };

  const handleMapClick = (position) => {
    if (position) {
      const { lat, lng } = position;
      setForm((prevState) => ({
        ...prevState,
        locations: [{ pointX: lng, pointY: lat }],
      }));
    }
  };

  const handleAddTag = (tag) => {
    setForm((prevState) => ({
      ...prevState,
      tags: [...prevState.tags, tag],
    }));
  };

  const handleRemoveTag = (tagId) => {
    setForm((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag.id !== tagId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const eventTypeOptions = Object.keys(EventTypes).map((key) => ({
    value: EventTypes[key],
    label: key,
  }));

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
        <CustomSelect
          id="type"
          name="type"
          options={eventTypeOptions}
          value={eventTypeOptions.find(option => option.value === form.type)}
          onChange={handleSelectChange}
          isClearable={false}
        />
      </label>
      <ImageUploader onImageChange={handleImageChange} styles={styles} />
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
      <EventTags
        isEditing={isEditing}
        tags={form.tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />
      <MapSelector onMapClick={handleMapClick} styles={styles} />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default AddEventForm;
