import React, { useEffect, useRef, useState } from "react";

import CustomSelect from "../utils/CustomSelect/CustomSelect";
import EventTags from "./EventTags";
import EventTypes from "../../models/EventTypes";
import ImageUploader from "./ImageUploader";
import Input from "../utils/Input/Input";
import MapSelector from "./MapSelector";
import { fetchPostEvent } from "../../clients/response";
import styles from "./AddEventForm.module.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AddEventForm = ({ onSubmit, url, initialForm = null }) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.tokenValue.token);
  const imageUploaderRef = useRef();

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: 0,
    userId: user.id,
    imgUpload: null, // Ensure this will be a File object
    ageLimit: 0,
    date: "",
    link: "",
    locations: [{ pointX: 0, pointY: 0 }],
    tags: [],
  });
  const [initialFile, setInitialFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
      if (initialForm.img) {
        const blob = base64ToBlob(initialForm.img);
        const file = new File([blob], "event-image.jpeg", { type: blob.type });
        setInitialFile(file);
        handleImageChange(file);
      }
    }
  }, [initialForm]);

  const base64ToBlob = (base64Str) => {
    if (!base64Str.startsWith("data:image/jpeg;base64,")) {
      base64Str = "data:image/jpeg;base64," + base64Str;
    }

    const byteCharacters = atob(base64Str.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "image/jpeg" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setForm((prevState) => ({
      ...prevState,
      type: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleImageChange = (file) => {
    setForm((prevState) => ({
      ...prevState,
      imgUpload: file, // Store the File object directly
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
      !form.imgUpload || // Ensure imgUpload is a File object
      form.ageLimit === 0 ||
      !form.date ||
      !form.link ||
      form.locations[form.locations.length - 1].pointX === 0 ||
      form.locations[form.locations.length - 1].pointY === 0
    ) {
      setError(t("Please fill out all fields and select a location on the map."));
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("type", form.type);
    formData.append("userId", form.userId);
    formData.append("imgUpload", form.imgUpload); // Append the File object directly
    formData.append("ageLimit", form.ageLimit);
    formData.append("date", form.date);
    formData.append("link", form.link);
    formData.append("locations[0].pointX", form.locations[form.locations.length - 1].pointX);
    formData.append("locations[0].pointY", form.locations[form.locations.length - 1].pointY);

    form.tags.forEach((tag, index) => {
      formData.append(`tags[${index}].id`, tag.id);
      formData.append(`tags[${index}].name`, tag.name);
      formData.append(`tags[${index}].color`, tag.color);
    });

    if (form.id) {
      formData.append("id", form.id);
    }

    const config = {
      body: formData,
      headers: {},
    };

    try {
      const response = await fetchPostEvent(url, token, config);
      if (!response.isError) {
        onSubmit(response.data);
      } else {
        setError(t("Failed to submit event. Please try again."));
      }
    } catch (error) {
      console.error(t("Error submitting event"), error);
      setError(t("Failed to submit event. Please try again."));
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
        label={t("Event Name")}
        id="name"
        className={styles.input}
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder={t("Event Name")}
        required
      />
      <label>
        {t("Event Description")}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        ></textarea>
      </label>
      <label>
        {t("Event Type")}
        <CustomSelect
          id="type"
          name="type"
          options={eventTypeOptions}
          value={eventTypeOptions.find(option => option.value === form.type)}
          onChange={handleSelectChange}
          isClearable={false}
        />
      </label>
      <ImageUploader
        onImageChange={handleImageChange}
        styles={styles}
        initialFile={initialFile} // Pass the initial file to ImageUploader
        ref={imageUploaderRef} // Use ref
      />
      <Input
        label={t("Age Limit")}
        id="ageLimit"
        type="number"
        className={styles.input}
        name="ageLimit"
        value={form.ageLimit}
        onChange={handleChange}
        placeholder={t("Age Limit")}
        required
      />
      <Input
        label={t("Event Date and Time")}
        id="date"
        type="datetime-local"
        className={styles.input}
        name="date"
        value={form.date}
        onChange={handleChange}
        placeholder={t("Event Date and Time")}
        required
      />
      <Input
        label={t("Event Link")}
        id="link"
        className={styles.input}
        name="link"
        value={form.link}
        onChange={handleChange}
        placeholder={t("Event Link")}
        required
      />
      <EventTags
        isEditing={true}
        tags={form.tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />
      <MapSelector onMapClick={handleMapClick} styles={styles} event={initialForm}/>
      <button type="submit">{initialForm ? t("Update Event") : t("Add Event")}</button>
    </form>
  );
};

export default AddEventForm;
