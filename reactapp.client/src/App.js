import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { center, events } from "./const_values";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminPage from "./pages/AdminPage";
import ChatBot from "./components/chat/ChatBot";
import EventPage from "./pages/EventPage";
import { LoginPage } from "./pages/LoginPage";
import MainPage from "./pages/Home/MainPage";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import { Register } from "./components/auth/Register/Register";
import { logout } from "./reducers/auth.reducer";

const ONE_MINUTE = 1000 * 60;

const App = () => {
  const [eventsData, setEventsData] = useState(events);

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isAuthenticated, setAuthenticated] = useState(
    () => !!authState.tokenValue
  );

  const handleAuth = useCallback(() => {
    const currentTime = Date.now();
    if (
      !authState.tokenValue ||
      !authState.tokenExpirationTime ||
      currentTime >= authState.tokenExpirationTime
    ) {
      setAuthenticated(false);
      dispatch(logout());
      return;
    }

    setAuthenticated(true);
  }, [authState.tokenValue, authState.tokenExpirationTime, dispatch]);

  useEffect(() => {
    handleAuth();
    const interval = setInterval(() => {
      handleAuth();
    }, ONE_MINUTE);

    return () => clearInterval(interval);
  }, [handleAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated || !authState.user ? (
          <>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/registration" element={<Register />} />
            <Route path="/*" element={<Navigate to="/auth/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<MainPage />}>
              <Route
                path="map"
                element={
                  <MapPage
                    eventsData={eventsData}
                    center={center}
                    setEventsData={setEventsData}
                  />
                }
              />
              <Route
                path="events"
                element={
                  <EventPage
                    eventsData={eventsData}
                    setEventsData={setEventsData}
                  />
                }
              />
              <Route
                path="admin"
                element={
                  <AdminPage                  />
                }
              />
              <Route path="chat" element={<ChatBot></ChatBot>} />
              <Route
                path="profile"
                element={
                  <ProfilePage
                    eventsData={eventsData}
                    setEventsData={setEventsData}
                  ></ProfilePage>
                }
              />
              <Route path="*" element={<Navigate to="/map" />} />
            </Route>
            <Route path="*" element={<Navigate to="/map" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
