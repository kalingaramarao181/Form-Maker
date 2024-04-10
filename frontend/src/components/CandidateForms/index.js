import React, { useEffect, useState } from "react"
import axios from "axios"
import "./index.css"
import { FaWpforms } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const CandidateForms = (props) => {
    const {history} = props
    const [tables, setTables] = useState([])
    const [searchValue, setSearchValue] = useState([])
    const [candidateDbData, setCandidateDbData] = useState([])
    const candidateData = JSON.parse(localStorage.getItem("candidateData"))
    const {email, name} = candidateData



    useEffect(() => {
        axios.get("http://localhost:4000/candidate-data/"+email)
        .then(res => setCandidateDbData(res.data.map(item => item.tableid)))
        .catch(err => console.log(err))
    })

    useEffect(() => {
        axios.get("http://localhost:4000/tables")
        .then(res => setTables(res.data))
        .catch(err => console.log(err))
    }, [])

    const actualData = tables.filter(item => candidateDbData.includes(item.slice(item.length - 7)))

    const newData = actualData.filter(item => item.includes(searchValue))

    const onClickFormTab = (tbName) => {
        localStorage.setItem("tableName", tbName)
        history.push("/survey-form")
    }
    return (
        <div className="client-forms-table-view-main-container">
        <h1 className="client-forms-table-heading"><span className="client-servey-form-details-heading-span">{name} </span> Forms:</h1>
        <input onChange={(e) => setSearchValue(e.target.value)} type="search" placeholder="Search your Form" className="client-forms-search-input"/>
        <div className="client-forms-table-view-container" style={newData.length === 0 ? {flexDirection:"column"}:{flexDirection:"row"}}>
            {newData.length === 0 ? <p className="client-forms-table-search-data-err">No Data Found</p>:<>
            {newData.map((eachTable) => {
                return (
                    <button onClick={() => onClickFormTab(eachTable)} type="button" className="client-forms-table-view-button">
                        <FaWpforms className="forms-table-view-button-icon"/>
                        {eachTable.slice(0,eachTable.length - 7).charAt(0).toUpperCase()+ eachTable.slice(0, eachTable.length - 7).substr(1).toLowerCase()}
                    </button>
                )
            })}</>
        }
            <Link to="client-create-form">
                <button type="button" className="client-forms-table-view-button-add">
                        <MdOutlineLibraryAdd className="client-forms-table-view-button-add-icon"/>
                </button>
            </Link>
        </div>
        </div>
    )
}

export default CandidateForms