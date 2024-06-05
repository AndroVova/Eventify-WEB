import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminPage from "./pages/AdminPage";
import AdminTagsPage from "./pages/AdminTagsPage";
import ChatBot from "./components/chat/ChatBot";
import EventPage from "./pages/EventPage";
import { LoginPage } from "./pages/LoginPage";
import MainPage from "./pages/Home/MainPage";
import MapPage from "./pages/MapPage";
import Modal from "react-modal";
import MyEvents from "./pages/MyEvents";
import ProfilePage from "./pages/ProfilePage";
import { Register } from "./components/auth/Register/Register";
import { events } from "./const_values";
import { logout } from "./reducers/auth.reducer";

const ONE_MINUTE = 1000 * 60;
Modal.setAppElement("#root");

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
      console.log("LOGGING OUT");
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
              <Route path="map" element={<MapPage />} />
              <Route path="events" element={<EventPage />} />
              <Route path="events/my" element={<MyEvents />} />
              <Route path="admin/users" element={<AdminPage />} />
              <Route path="admin/tags" element={<AdminTagsPage />} />
               <Route path="admin/events" element={<p>EVENTS</p>} />
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
