import React, { useState } from "react";
import "./index.css";
import axios from "axios";
import Cookies from 'js-cookie'
import Admin from "../Admin"
import baseUrl from "../config";


const LoginForm = (props) => {
    const adminToken = Cookies.get("adminToken")
    const { history } = props;
    const [errorMessage, setErrorMessage] = useState()
    const [data, setData] = useState({
        username: "",
        password: "",
    });
    const { username, password } = data;
    const changehandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const submithandler = (e) => {
        e.preventDefault();
        axios.post(`${baseUrl}admin-login`, { ...data })
            .then((res) => {
                if (res.statusText === "OK"){
                Cookies.set("adminToken", res.data.jwtToken, {expires: 1/24})
                history.replace("/admin")
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Server responded with status code:', error.response.status);
                    if (error.response.status === 400) {
                      // Handle 400 Bad Request (e.g., display error message to user)
                      setErrorMessage(error.response.data.error);
                    } else {
                      // Handle other status codes
                      setErrorMessage('Unexpected error:', error.response.data.error);
                    }
                  } else if (error.request) {
                    // The request was made but no response was received
                    setErrorMessage('No response received from server');
                  } else {
                    // Something happened in setting up the request that triggered an error
                    setErrorMessage('Error setting up request:', error.message);
                  }
            });
        setData({
            username: "",
            password: "",
        })
    };
    return (
        
        <>
        {adminToken === undefined ?
            <div className="admin-main-container">
                <h1 className="main-heading">ADMIN PANNEL</h1>
                <form className="admin-container" onSubmit={submithandler}>
                    <h1 className="admin-login-heading">Admin Login</h1>
                    <label className="admin-labels">UserName</label>
                    <input
                        type="text"
                        className="admin-input"
                        placeholder="Enter Your UserName"
                        name="username"
                        value={username}
                        onChange={changehandler}
                        required
                    />
                    <label className="admin-labels">Password</label>
                    <input
                        type="password"
                        className="admin-input"
                        placeholder="Enter Your Password"
                        name="password"
                        value={password}
                        onChange={changehandler}
                        required
                    />
                    <input type="submit" className="admin-submit" />
                    {errorMessage && <p className="login-error-message">{errorMessage}</p>}
                </form>
            </div> : <Admin />}
        </>
    );
};

export default LoginForm;
