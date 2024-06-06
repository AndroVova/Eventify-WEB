import Input from "../utils/Input/Input";
import React from "react";
import { useTranslation } from "react-i18next";

const ImageUploader = ({ onImageChange, styles }) => {
  const { t } = useTranslation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64String = e.target.result.split(",")[1];
        resizeImage(base64String, 200, 200);
      };
      reader.readAsDataURL(file);
    }
  };

  const resizeImage = (base64Str, newWidth, newHeight) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const resizedBase64 = canvas.toDataURL("image/jpeg");
      const byteString = atob(resizedBase64.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: "image/jpeg" });
      onImageChange(blob);
    };
    img.src = "data:image/jpeg;base64," + base64Str;
  };

  return (
    <Input
      label={t("Event Image")}
      id="imgUpload"
      type="file"
      className={styles.input}
      name="imgUpload"
      onChange={handleImageChange}
      required
    />
  );
};

export default ImageUploader;
