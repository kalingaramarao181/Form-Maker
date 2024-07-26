import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Redirect, Route } from 'react-router-dom';
import baseUrl from '../config';

function ProtectedRoute(props) {
  const [authenticated, setAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true); // Added loading state
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${baseUrl}protected-route`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthenticated(true);
      } catch (error) {
        console.log(error.response.data.error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth(); // Call the function to check authentication
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; // Handle loading state
  }

  if (!authenticated) {
    return <Redirect to="/candidate-purchage" />;
  }

  return <Route {...props} />;
}

export default ProtectedRoute;
