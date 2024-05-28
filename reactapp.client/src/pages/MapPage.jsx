import Map from "../components/map/Map";
import React from "react";
import styles from "./MapPage.module.css";

const MapPage = ({ eventsData, center, setEventsData }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.mapWrapper}>
        <Map
          center={center}
          markersData={eventsData}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
          setEventsData={setEventsData}
        />
      </div>
    </div>
  );
};

export default MapPage;
