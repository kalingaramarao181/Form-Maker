import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { FaWpforms } from "react-icons/fa";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import baseUrl from "../config";

const FormsData = () => {
    const [forms, setForms] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        axios.get(`${baseUrl}all-responses`)
            .then(res => {
                setForms(res.data);
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const onClickFormTab = (formid) => {
            localStorage.setItem("formId", formid);
            localStorage.setItem("sidebarButtonStatus", "FormResponses")
            window.location.reload()
    };

    const filterForms = forms.length !== 0 ? forms.filter(eachForm => eachForm.formname.toLowerCase().includes(searchValue.toLowerCase())) : [];
    return (
        <div className="forms-table-view-main-container">
                <h1 className="forms-table-heading">Forms Responses</h1>
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
                        filterForms.map((eachForm, index) => (
                            <button key={index} onClick={() => onClickFormTab(eachForm.formid)} type="button" className="forms-table-view-button">
                                <FaWpforms className="forms-table-view-button-icon" />
                                {eachForm.formname} ({eachForm.formcount})
                            </button>
                        ))
                    )}
                </div>
            </div>
    );
}

export default withRouter(FormsData);
