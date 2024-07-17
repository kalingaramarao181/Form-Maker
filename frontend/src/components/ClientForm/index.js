import React, { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import "./index.css"
import { useHistory } from "react-router-dom";

import baseUrl from "../config"


const ClintForm = (props) => {
    const [data, setData] = useState([])
    const history = useHistory(); // Use useHistory hook

    const inputHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const onSubmitForm = (e) => {
        e.preventDefault()
        axios.post(`${baseUrl}signup-user`, { ...data })
            .then(res => {
                Cookies.set("jwtToken", res.data.token, { expires: 15 / 1440 });
                localStorage.setItem("candidateData", JSON.stringify(data));
                alert(`Your data has been successfully submitted, ${data.name}!`);
                history.push("/create-form");
            })
            .catch(err => {
                if (err.response) {
                    // Server responded with a status other than 200 range
                    alert(`Error: ${err.response.data.error}`);
                } else if (err.request) {
                    // Request was made but no response received
                    alert('Error: No response from server.');
                } else {
                    // Something else happened in setting up the request
                    alert(`Error: ${err.message}`);
                }
                console.log(err);
            });

    }
    return (
        <div className="form-table-client-form-container">
            <div>
                <img src="/images/signup-image.png" alt="signup" className="signup-image" />
            </div>
            <form onSubmit={onSubmitForm} style={{ width: "40vw" }} className="forms-table-form">
                <h1>Client Form</h1>
                <div className="forms-table-form-container">
                    <label className="forms-table-input-label">Name:</label>
                    <input name='name' onChange={inputHandler} style={{ width: "35vw", padding: "0.8vw" }} className="forms-table-name-input" type='text' placeholder={'Enter Name'} required />
                    <label className="forms-table-input-label">Email:</label>
                    <input name='email' onChange={inputHandler} style={{ width: "35vw", padding: "0.8vw" }} className="forms-table-name-input" type='text' placeholder={'Enter Email'} required />
                    <label className="forms-table-input-label">Phone Number:</label>
                    <input name='phoneno' onChange={inputHandler} style={{ width: "35vw", padding: "0.8vw" }} className="forms-table-name-input" type='text' placeholder={'Enter Phone Number'} required />
                    <label className="forms-table-input-label">Location:</label>
                    <input name='location' onChange={inputHandler} style={{ width: "35vw", padding: "0.8vw" }} className="forms-table-name-input" type='text' placeholder={'Enter Location'} required />
                    <label className="forms-table-input-label">Address:</label>
                    <textarea onChange={inputHandler} style={{ width: "35vw", padding: "0.8vw" }} cols={30} rows={6} className="forms-table-name-input" type='text' name='address' placeholder='Enter Address' required />
                </div>
                <button type="submit" className="forms-table-submit-button">Submit</button>
            </form>
        </div>
    )
}

export default ClintForm