import NavBar from '../../components/utils/NavBar/NavBar';
import {Outlet} from 'react-router-dom';
import React, {} from 'react';

export const MainPage = () => {

  return (
    <>
      <NavBar/>
      <Outlet />
    </>
  );
};

export default MainPage;