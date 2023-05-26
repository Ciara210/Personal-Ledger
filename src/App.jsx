import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { ConfigProvider } from 'zarm';
import routes from '@/router';
import NavBar from '@/components/NavBar';

const  App = () => {
  const location = useLocation()
  const { pathname } = location 
  const needNav = ['/', '/data', '/user'] 
  const [showNav, setShowNav] = useState(false)
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]) 
  return <ConfigProvider primaryColor={'#007fff'}>
    <>
      <Routes>
        {routes.map(route => <Route exact key={route.path} path={route.path} element={<route.component />} />)}
      </Routes>
      <NavBar showNav={showNav} />
    </>
  </ConfigProvider>;
};

export default App;