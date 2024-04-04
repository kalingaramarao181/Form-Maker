import React, { useEffect, useState } from "react"
import axios from "axios"
import "./index.css"
import { FaWpforms } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const FormsData = (props) => {
    const {history} = props
    const [tables, setTables] = useState([])
    const [searchValue, setSearchValue] = useState([])

    useEffect(() => {
        axios.get("http://localhost:4000/tables")
        .then(res => setTables(res.data))
        .catch(err => console.log(err))
    }, [])



    const newData = []
    for (let table of tables){
        if (table.includes(searchValue)){
            newData.push(table)
        }
    }


    const onClickFormTab = (tbName) => {
        localStorage.setItem("tableName", tbName)
        history.push("/survey-form-data")
    }

    return (
        <div className="forms-table-view-main-container">
        <h1 className="forms-table-heading">Forms Data</h1>
        <input onChange={(e) => setSearchValue(e.target.value)} type="search" placeholder="Search your Form" className="forms-search-input"/>
        <div className="forms-table-view-container" style={newData.length === 0 ? {flexDirection:"column"}:{flexDirection:"row"}}>
            {newData.length === 0 ? <p className="forms-table-search-data-err">No Data Found</p>:<>
            {newData.map((eachTable) => {
                if (eachTable.slice(eachTable.length - 4) === "form"){
                return (
                    <button onClick={() => onClickFormTab(eachTable)} type="button" className="forms-table-view-button">
                        <FaWpforms className="forms-table-view-button-icon"/>
                        {eachTable.slice(0,eachTable.length - 4).charAt(0).toUpperCase()+ eachTable.slice(0, eachTable.length - 4).substr(1).toLowerCase()}
                    </button>
                )
                }
                return <></>
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

export default FormsData