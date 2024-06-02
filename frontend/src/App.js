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
TODO 
Delete plant button x
  - new endpoint
  - delete button component (pop up window for confirmation?)

Format displayed dates x
Re-render Plants when a plant is added or deleted
Display days since rain
Endpoint and button to edit a plant's daysSinceRain (maybe)

Weather API gets called every 24 hours
Gets called for each plant in database with its location as the query
If it is raining or is expected to rain that day (chance > 50%): daysSinceRain = 0 ? daysSinceRain++; 
Email notifications
UI 
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
