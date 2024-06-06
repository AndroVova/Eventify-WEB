import Map from "../map/Map";
import React from "react";
import { useTranslation } from "react-i18next";

const MapSelector = ({ onMapClick, styles }) => {
  const { t } = useTranslation();
  
  return (
    <label>
      {t("Event Location")}
      <div className={styles.mapContainer}>
        <Map markersData={[]} onMarkerPositionChange={onMapClick} />
      </div>
    </label>
  );
};

export default MapSelector;
