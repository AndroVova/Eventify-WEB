import React, { useEffect, useState } from "react";

import Map from "../components/map/Map";
import axios from "axios";
import styles from "./MapPage.module.css";

const MapPage = () => {
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://eventify-backend.azurewebsites.net/api/Event/get-events",
          { pageSize: 100 }
        );
        if (response.status === 200) {
          setEventsData(response.data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {isLoading ? (
        <div className={styles.loader}></div>
      ) : (
        <div className={styles.mapWrapper}>
          <Map
            markersData={eventsData}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
            }}
            setEventsData={setEventsData}
          />
        </div>
      )}
    </div>
  );
};

export default MapPage;
