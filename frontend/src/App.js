import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage/Homepage';
import Dashboard from './pages/dashboard/Dashboard';
import Plants from './pages/plants/Plants';
import './App.css'
import {Auth0Provider} from '@auth0/auth0-react'
import ProtectedRoute from './components/ProtectedRoute';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientID = process.env.REACT_APP_AUTH0_CLIENT_ID;

/*
Will probably just use templates for most pages
TODO 
Setup for login and registration with Auth0 x
Configure site authorization x
Setup backend and mongoDB x
Allow users to add their plants and then view the plants + additional info
Additional info being how often to water and when to next water
*/

function App() {

  const onRedirectCallback = (appState) => {
    window.history.replaceState(
      {},
      document.title,
      appState?.returnTo || window.location.pathname
    );
  };
  
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plants"
            element={
              <ProtectedRoute>
                <Plants />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Auth0Provider>
  );
};

export default App;
