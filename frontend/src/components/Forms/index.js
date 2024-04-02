import React, { useEffect, useState } from "react"
import axios from "axios"
import "./index.css"
import { FaWpforms } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Form from "../Form";

const Forms = () => {
    const [tables, setTables] = useState([])
    const [formData, setFormData] = useState([])
    let tableName = localStorage.getItem("tableName")
    useEffect(() => {
        axios.get("http://localhost:4000/tables")
        .then(res => setTables(res.data))
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get("http://localhost:4000/columns/"+tableName)
        .then(res => setFormData(res.data))
        .catch(err => console.log(err))
    }, [tableName])

    const onClickFormTab = (tbName) => {
        localStorage.setItem("tableName", tbName)
        window.location.reload()
    }

    return (
        <div className="forms-table-view-main-container">
        <h1>Forms</h1>
        <div className="forms-table-view-container">
            {tables.map((eachTable) => {
                if (eachTable.slice(eachTable.length - 4) === "form"){
                return (
                    <button onClick={() => onClickFormTab(eachTable)} type="button" className="forms-table-view-button">{eachTable.slice(0,eachTable.length - 4).charAt(0).toUpperCase()+ eachTable.slice(0, eachTable.length - 4).substr(1).toLowerCase()}
                        <FaWpforms className="forms-table-view-button-icon"/>
                    </button>
                )
                }
                return <></>
            })}
            <Link to="create-form">
                <button type="button" className="forms-table-view-button-add">
                        <MdOutlineLibraryAdd className="forms-table-view-button-add-icon"/>
                </button>
            </Link>
        </div>
        <farm className="forms-table-form">
            <h1>{tableName.slice(0, tableName.length - 4).charAt(0).toUpperCase() + tableName.slice(0, tableName.length - 4).substr(1).toLowerCase() + " Form"}</h1>
            {formData.map((eachData) => {
                if (eachData.name === "id"){
                    return null
                }
                return (
                    <div className="forms-table-form-container">
                        <label className="forms-table-input-label">{eachData.name}:</label>
                        <input className="forms-table-name-input" type={eachData.type} placeholder={`Enter ${eachData.name}`}/>
                    </div>
                )
            })}
            <button className="forms-table-submit-button">Submit</button>
        </farm>
        </div>
    )
}

export default Forms