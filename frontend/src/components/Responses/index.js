import React, { useEffect, useState } from "react"
import axios from "axios"
import "./index.css"
import { FaWpforms } from "react-icons/fa";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import baseUrl from "../config";

const FormsData = (props) => {
    const { history } = props
    const [forms, setForms] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [ setSearchValue] = useState("")

    useEffect(() => {
        axios.get(`${baseUrl}all-responses`)
            .then(res => {
                setForms(res.data)
                filterData(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    const filterData = (data) => {
        const newData = data.filter(table => table.slice(table.length - 4) === "form")
        setFilteredData(newData)
    }

    const onClickFormTab = (tbName) => {
        localStorage.setItem("tableName", tbName)
        history.push("/survey-form-data")
    }

    const handleSearchChange = (e) => {
        const searchValue = e.target.value
        setSearchValue(searchValue)
        const filteredData = tables.filter(table => table.includes(searchValue) && table.slice(table.length - 4) === "form")
        setFilteredData(filteredData)
    }

    return (
        <div className="forms-table-view-main-container">
            <h1 className="forms-table-heading">Forms Data</h1>
            <input onChange={handleSearchChange} type="search" placeholder="Search your Form" className="forms-search-input" />
            <div className="forms-table-view-container" style={filteredData.length === 0 ? { flexDirection: "column" } : { flexDirection: "row" }}>
                {filteredData.length === 0 ? <p className="forms-table-search-data-err">No Data Found</p> :
                    filteredData.map((eachTable, index) => (
                        <button key={index} onClick={() => onClickFormTab(eachTable)} type="button" className="forms-table-view-button">
                            <FaWpforms className="forms-table-view-button-icon" />
                            {eachTable.slice(0, eachTable.length - 4).charAt(0).toUpperCase() + eachTable.slice(0, eachTable.length - 4).substr(1).toLowerCase()}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default withRouter(FormsData)
