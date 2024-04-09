import React, { useState } from "react";
import "./index.css";
import axios from "axios";
import Cookies from 'js-cookie'


const LoginForm = (props) => {
    const { history } = props;
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
        axios.post("http://localhost:4000/admin-login", { ...data })
            .then((res) => {
                console.log(res.data)
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Server responded with status code:', error.response.status);
                    if (error.response.status === 400) {
                      // Handle 400 Bad Request (e.g., display error message to user)
                      console.log(error.response.data.error);
                    } else {
                      // Handle other status codes
                      console.log('Unexpected error:', error.response.data.error);
                    }
                  } else if (error.request) {
                    // The request was made but no response was received
                    console.log('No response received from server');
                  } else {
                    // Something happened in setting up the request that triggered an error
                    console.log('Error setting up request:', error.message);
                  }
            });
        setData({
            username: "",
            password: "",
        })
    };
    return (
        <>
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
                </form>
            </div>
        </>
    );
};

export default LoginForm;
