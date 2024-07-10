import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect, Route } from 'react-router-dom';
import Cookies from "js-cookie"
import baseUrl from '../config';



function ProtectedRoute(props) {
  const [authenticated, setAuthenticated] = useState(true);
  const token = Cookies.get("jwtToken")

  useEffect(() => {
    if (!token) {
      setAuthenticated(false);
      console.log('Token is missing')
      return;
    }
    axios.get(`${baseUrl}protected-route`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setAuthenticated(true);
      })
      .catch(error => {
        console.log(error.response.data.error);
        setAuthenticated(false);
      })
  }, [token]);

  if (!authenticated) {
    return <Redirect to="/candidate-purchage" />;
  }
  return <Route {...props} />;
}

export default ProtectedRoute;
