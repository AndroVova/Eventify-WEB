import { Autocomplete, GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import DraggableModal from '../layout/DraggableModal/DraggableModal';
import Event from '../events/Event';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import artIcon from "../../resources/icons/art-design-paint-pallet-format-text-svgrepo-com.svg";
import carnivalIcon from "../../resources/icons/carnival-symbol-svgrepo-com.svg";
import concertIcon from "../../resources/icons/concert-piano-orchestra-classic-instrument-svgrepo-com.svg";
import defaultIcon from "../../resources/icons/marker-pin-01-svgrepo-com.svg";
import foodIcon from "../../resources/icons/food-restaurant-svgrepo-com.svg";
import musicIcon from "../../resources/icons/music-notes-svgrepo-com.svg";
import sportIcon from "../../resources/icons/running-svgrepo-com.svg";
import styles from './map.module.css';
import techIcon from "../../resources/icons/computer-code-svgrepo-com.svg";
import theaterIcon from "../../resources/icons/theater-svgrepo-com.svg";
import { useSelector } from "react-redux";

const libraries = ['places', 'marker'];

const Map = ({ center, markersData, mapContainerStyle, options, isModal = false, setEventsData, onMarkerPositionChange }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries
  });  

  const user = useSelector((state) => state.auth.user);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapStyle, setMapStyle] = useState("light");
  const [key, setKey] = useState(1);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isMarkersLoading, setIsMarkersLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(isModal);
  const [userLocation, setUserLocation] = useState(center);

  const categoryIcons = useMemo(() => ({
    default: defaultIcon,
    1: musicIcon,
    2: artIcon,
    3: theaterIcon,
    4: carnivalIcon,
    5: techIcon,
    6: concertIcon,    
    7: sportIcon,
    8: foodIcon,    
  }), []);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    setTimeout(() => {
      setIsMapLoading(false);
    }, 1300);
  }, []);

  const onLoadAutocomplete = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        console.log(lat + " " + lng);
        if (map) {
          map.setCenter({ lat, lng });
          map.setZoom(15);

          const markerElement = document.createElement('div');
          markerElement.className = styles['marker-icon'];
          markerElement.innerHTML = `<img src=${defaultIcon} alt="Event Location" />`;

          new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat, lng },
            map: map,
            title: "Event Location",
            content: markerElement
          });

          if (onMarkerPositionChange) {
            onMarkerPositionChange({ lat, lng });
          }
        }
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setUserLocation(userLocation);
          if (map) {
            map.setCenter(userLocation);

            const iconElement = document.createElement('div');
            iconElement.className = styles['marker-icon'];

            const img = document.createElement('img');
            img.src = user.image;
            img.alt = 'Your location';

            iconElement.appendChild(img);

            new window.google.maps.marker.AdvancedMarkerElement({
              position: userLocation,
              title: "You are here",
              map,
              content: iconElement
            });
          }
        },
        () => {
          console.error("Error getting user location");
        }
      );
    }
  }, [map, user.image]);

  useEffect(() => {
    if (isLoaded && map && window.google && markersData) {
      const markers = markersData.map(marker => {
        const iconElement = document.createElement('div');
        iconElement.className = styles['marker-icon'];

        const markerIcon = categoryIcons[marker.type] || defaultIcon;
        const img = document.createElement('img');
        img.src = markerIcon;
        img.alt = marker.name;

        iconElement.appendChild(img);

        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: marker.locations.pointY, lng: marker.locations.pointX },
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
  }, [isLoaded, map, markersData, categoryIcons]);

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

  const handleMapClick = (event) => {
    if (event && event.latLng && map) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      console.log(lat + " " + lng);
      if (window.marker) {
        window.marker.setMap(null);
      }
  
      const markerElement = document.createElement('div');
      markerElement.className = styles['marker-icon'];
      markerElement.innerHTML = `<img src="${defaultIcon}" alt="Event Location" />`;
  
      window.marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: { lat, lng },
        map: map,
        title: "Event Location",
        content: markerElement
      });
      
      if (onMarkerPositionChange) {
        onMarkerPositionChange({ lat, lng });
      }
    }
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
      <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
        <input
          style={{width: '50%'}}
          type="text"
          placeholder="Search for places"
          className={styles.searchBox}
        />
      </Autocomplete>
      <GoogleMap
        key={key}
        mapContainerStyle={mapContainerStyle || { width: '100%', height: '100%' }}
        center={userLocation}
        zoom={10.5}
        onLoad={onLoad}
        onClick={handleMapClick}
        options={{
          ...options,
          mapId: mapId,
          mapTypeControl: false,
        }}
      >
        {selectedMarker && !modalIsOpen && (
          <DraggableModal isVisible={true} onClose={closeModal} headerText="Event Details">
            <Event event={selectedMarker} onClose={closeModal} setEventsData={setEventsData} />
          </DraggableModal>
        )}
      </GoogleMap>
    </div>
  ) : <div>Loading...</div>;
};

export default Map;
