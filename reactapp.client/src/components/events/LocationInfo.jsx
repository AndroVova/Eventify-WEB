import React, { useCallback, useEffect, useState } from "react";

import { useSelector } from "react-redux";

const LocationInfo = ({ lat, lng }) => {
  const [locationInfo, setLocationInfo] = useState("");
  const user = useSelector((state) => state.auth.user);

  const fetchLocationInfo = useCallback(async () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API;
    const localization = user.settings.language === 0 ? "en" : "ua" 
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=${localization}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const locality = data.results.find(result => result.types.includes("locality"));
        const areaLevel1 = data.results.find(result => result.types.includes("administrative_area_level_1"));
        const country = data.results.find(result => result.types.includes("country"));

        if (locality) {
          setLocationInfo(locality.address_components[0].long_name);
        } else if (areaLevel1) {
          setLocationInfo(areaLevel1.address_components[0].long_name);
        } else if (country) {
          setLocationInfo(country.address_components[0].long_name);
        } else {
          setLocationInfo("Location not found");
        }
      } else {
        console.error("Geocoding API error:", data.error_message);
        setLocationInfo("Geocoding API error");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setLocationInfo("Request failed");
    }
  }, [lat, lng, user.settings.language ]);

  useEffect(() => {
    fetchLocationInfo();
  }, [fetchLocationInfo]);

  return (
    <p>{locationInfo}</p>
  );
};

export default LocationInfo;
