import Map from "../map/Map";
import React from "react";

const MapSelector = ({ onMapClick, styles }) => {
  return (
    <label>
      Event Location
      <div className={styles.mapContainer}>
        <Map markersData={[]} onMarkerPositionChange={onMapClick} />
      </div>
    </label>
  );
};

export default MapSelector;
