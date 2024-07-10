import React, { useEffect, useState } from "react"
import axios from "axios"
import "./index.css"
import { FaWpforms } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { Link, withRouter } from "react-router-dom/cjs/react-router-dom.min";
import baseUrl from "../config";

const Forms = (props) => {
    const {history} = props
    const [forms, setForms] = useState([])
    const [searchValue, setSearchValue] = useState([])

    useEffect(() => {
        axios.get(`${baseUrl}all-forms`)
        .then(res => {
            setForms(res.data)
            console.log(res.data);
    })
        .catch(err => console.log(err))
    }, [])



    const searchedData = forms.filter((form) => form.formname.includes(searchValue))


    const onClickFormTab = (formId) => {
        localStorage.setItem("formId", formId)
        history.push("/form/" + formId)
    }

    return (
        <div className="forms-table-view-main-container">
        <h1 className="forms-table-heading">Forms:</h1>
        <input onChange={(e) => setSearchValue(e.target.value)} type="search" placeholder="Search your Form" className="forms-search-input"/>
        <div className="forms-table-view-container" style={searchedData.length === 0 ? {flexDirection:"column"}:{flexDirection:"row"}}>
            {searchedData.length === 0 ? <p className="forms-table-search-data-err">No Data Found</p>:<>
            {searchedData.map((eachForm) => {
                return (
                    <button onClick={() => onClickFormTab(eachForm.formid)} type="button" className="forms-table-view-button">
                        <FaWpforms className="forms-table-view-button-icon"/>
                        {eachForm.formname}
                    </button>
                )
            })}</>
        }
            <Link to="create-form">
                <button type="button" className="forms-table-view-button-add">
                        <MdOutlineLibraryAdd className="forms-table-view-button-add-icon"/>
                </button>
            </Link>
        </div>
        </div>
    )
}

export default withRouter(Forms)