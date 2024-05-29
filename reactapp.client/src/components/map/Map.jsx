import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback, useEffect, useState } from 'react';

import DraggableModal from '../layout/DraggableModal/DraggableModal';
import Event from '../events/Event';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import artIcon from "../../resources/icons/art-design-paint-pallet-format-text-svgrepo-com.svg";
import carnivalIcon from "../../resources/icons/carnival-symbol-svgrepo-com.svg";
import concertIcon from "../../resources/icons/concert-piano-orchestra-classic-instrument-svgrepo-com.svg";
import defaultIcon from "../../resources/icons/marker-pin-01-svgrepo-com.svg";
import foodIcon from "../../resources/icons/food-restaurant-svgrepo-com.svg"
import musicIcon from "../../resources/icons/music-notes-svgrepo-com.svg";
import sportIcon from "../../resources/icons/running-svgrepo-com.svg";
import styles from './map.module.css';
import techIcon from "../../resources/icons/computer-code-svgrepo-com.svg";
import theaterIcon from "../../resources/icons/theater-svgrepo-com.svg";

const libraries = ['marker'];

const Map = ({ center, markersData, mapContainerStyle, options, isModal=false, setEventsData }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries
  });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [mapStyle, setMapStyle] = useState("light");
  const [key, setKey] = useState(1);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isMarkersLoading, setIsMarkersLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(isModal);

  const categoryIcons = {
    default: defaultIcon,
    art: artIcon,
    carnival: carnivalIcon,
    technology: techIcon,
    concert: concertIcon,
    music: musicIcon,
    sport: sportIcon,
    theater: theaterIcon,
    food: foodIcon,
  };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    setTimeout(() => {
      setIsMapLoading(false);
    }, 1300);
  }, []);

  useEffect(() => {
    if (isLoaded && map && window.google && markersData) {
      const markers = markersData.map(marker => {
        const iconElement = document.createElement('div');
        iconElement.className = styles['marker-icon'];

        const markerIcon = categoryIcons[marker.category.toLowerCase()] || defaultIcon; // Default to music icon if category not found
        const img = document.createElement('img');
        img.src = markerIcon;
        img.alt = marker.name;

        iconElement.appendChild(img);

        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
          position: marker.position,
          title: marker.name,
          map,
          content: iconElement
        });

        advancedMarker.addListener('click', () => {
          setSelectedMarker(marker);
        });

        return advancedMarker;
      });

      if (markers.length > 1) {
        new MarkerClusterer({ markers, map });
      }

      setIsMarkersLoading(false);
    }
  }, [isLoaded, map, markersData]);

  const handleStyleChange = (event) => {
    setMapStyle(event.target.value);
    setKey(prevKey => prevKey + 1);
    setIsMapLoading(true);
    setIsMarkersLoading(true);
  };

  const closeModal = () => {
    setSelectedMarker(null);
    setModalIsOpen(false);
  };

  if (loadError) {
    return <div>Map loading error</div>;
  }

  const mapId = mapStyle === "light" ? process.env.REACT_APP_MAP_ID : process.env.REACT_APP_NIGHT_MAP_ID;

  return isLoaded ? (
    <div className={`${styles.mapContainer} ${mapStyle === "light" ? "light-mode" : "dark-mode"}`}>
      <select onChange={handleStyleChange} value={mapStyle} className={styles.styleSelector}>
        <option value="light">Light Mode</option>
        <option value="styled">Night Mode</option>
      </select>
      {(isMapLoading || isMarkersLoading) && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <GoogleMap
        key={key}
        mapContainerStyle={mapContainerStyle || { width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        onLoad={onLoad}
        options={{
          ...options,
          mapId: mapId,
          mapTypeControl: false,
        }}
      >
        {selectedMarker && !modalIsOpen && (
          <DraggableModal isVisible={true} onClose={closeModal} headerText="Event Details">
            <Event event={selectedMarker} onClose={closeModal} setEventsData ={setEventsData} />
          </DraggableModal>
        )}
      </GoogleMap>
    </div>
  ) : <div>Loading...</div>;
};

export default Map;
