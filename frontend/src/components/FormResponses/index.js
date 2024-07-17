import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { FaWpforms } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import baseUrl from "../config";

const FormResponses = () => {
    const formid = localStorage.getItem("formId");
    const [FormResponses, setFormResponses] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const history = useHistory(); // Use useHistory hook

    useEffect(() => {
        axios.get(`${baseUrl}form-responses/${formid}`)
            .then(res => {
                setFormResponses(res.data);
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }, [formid]);

    const onClickResponseTab = (formid, responseid) => {
        history.push(`/response/${formid}/${responseid}`); // Navigate to the route
    };

    const filterForms = FormResponses.length !== 0 ? FormResponses.filter(eachResponse => JSON.parse(eachResponse.userdata).name.toLowerCase().includes(searchValue.toLowerCase())) : [];

    return (
        <div className="forms-table-view-main-container">
            <h1 className="forms-table-heading">Responses</h1>
            <input
                onChange={(e) => setSearchValue(e.target.value)}
                type="search"
                placeholder="Search your Form"
                className="forms-search-input"
            />
            <div className="forms-table-view-container" style={filterForms.length === 0 ? { flexDirection: "column" } : { flexDirection: "row" }}>
                {filterForms.length === 0 ? (
                    <p className="forms-table-search-data-err">No Data Found</p>
                ) : (
                    filterForms.map((eachResponse, index) => (
                        <button key={index} onClick={() => onClickResponseTab(eachResponse.formid, eachResponse.responseid)} type="button" className="forms-table-view-button">
                            <FaWpforms className="forms-table-view-button-icon" />
                            {JSON.parse(eachResponse.userdata).name}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default FormResponses;
