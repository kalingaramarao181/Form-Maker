import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom/cjs/react-router-dom.min";
import "./index.css";
import axios from "axios";
import { FaWpforms } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import baseUrl from "../config";

const ClientData = (props) => {
  const { history } = props
  const [data, setData] = useState([]);
  const [tables, setTables] = useState([])
  const [candidateDbData, setCandidateDbData] = useState([])
  const [searchValue, setSearchValue] = useState([])
  const [pageRender, setPageRender] = useState("Client")
  const [name, setName] = useState("Ramarao")
  const [email, setEmail] = useState("kalingaramarao181@gmail.com")



  useEffect(() => {
    axios.get(`${baseUrl}candidate-data/` + email)
      .then(res => setCandidateDbData(res.data.map(item => item.tableid)))
      .catch(err => console.log(err))
  })

  useEffect(() => {
    axios.get(`${baseUrl}tables`)
      .then(res => setTables(res.data))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    axios.get(`${baseUrl}client-data`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const onClickFormTab = (tbName) => {
    localStorage.setItem("tableName", tbName)
    history.push("/survey-form")
  }

  const onClickDetailsTab = (tbName) => {
    localStorage.setItem("tableName", tbName)
    history.push("/survey-form-data")
  }

  const onClickForms = (dbEmail, dbName) => {
    setPageRender("Forms")
    setEmail(dbEmail)
    setName(dbName)
  }
  const onClickData = (dbEmail, dbName) => {
    setPageRender("FormsData")
    setEmail(dbEmail)
    setName(dbName)
    console.log(dbEmail)
  }

  const actualData = tables.filter(item => candidateDbData.includes(item.slice(item.length - 7)))

  const newData = actualData.filter(item => item.includes(searchValue))

  //DELETE CLIENT
  const deleteHandler = (id) => {
    alert("successfully deleted")
    axios.delete(`${baseUrl}delete-client/` + id)
      .then(res => console.log(res.data))
  }

  const renderFormDetails = () => {
    return (
      <div className="client-forms-table-view-main-container">
        <h1 className="client-forms-table-heading"><span className="client-servey-form-details-heading-span">{name} </span> Forms:</h1>
        <input onChange={(e) => setSearchValue(e.target.value)} type="search" placeholder="Search your Form" className="client-forms-search-input" />
        <div className="client-forms-table-view-container" style={newData.length === 0 ? { flexDirection: "column" } : { flexDirection: "row" }}>
          {newData.length === 0 ? <p className="client-forms-table-search-data-err">No Data Found</p> : <>
            {newData.map((eachTable) => {
              return (
                <button onClick={() => onClickDetailsTab(eachTable)} type="button" className="client-forms-table-view-button">
                  <FaWpforms className="forms-table-view-button-icon" />
                  {eachTable.slice(0, eachTable.length - 7).charAt(0).toUpperCase() + eachTable.slice(0, eachTable.length - 7).substr(1).toLowerCase()}
                </button>
              )
            })}</>
          }
          <Link to="client-create-form">
            <button type="button" className="client-forms-table-view-button-add">
              <MdOutlineLibraryAdd className="client-forms-table-view-button-add-icon" />
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const renderClientData = () => {
    return (
      <div className="client-forms-table-view-main-container">
        <h1 className="client-forms-table-heading"><span className="client-servey-form-details-heading-span">{name} </span> Forms:</h1>
        <input onChange={(e) => setSearchValue(e.target.value)} type="search" placeholder="Search your Form" className="client-forms-search-input" />
        <div className="client-forms-table-view-container" style={newData.length === 0 ? { flexDirection: "column" } : { flexDirection: "row" }}>
          {newData.length === 0 ? <p className="client-forms-table-search-data-err">No Data Found</p> : <>
            {newData.map((eachTable) => {
              return (
                <button onClick={() => onClickFormTab(eachTable)} type="button" className="client-forms-table-view-button">
                  <FaWpforms className="forms-table-view-button-icon" />
                  {eachTable.slice(0, eachTable.length - 7).charAt(0).toUpperCase() + eachTable.slice(0, eachTable.length - 7).substr(1).toLowerCase()}
                </button>
              )
            })}</>
          }
          <Link to="client-create-form">
            <button type="button" className="client-forms-table-view-button-add">
              <MdOutlineLibraryAdd className="client-forms-table-view-button-add-icon" />
            </button>
          </Link>
        </div>
      </div>
    )
  }




  return (
    <>
      {pageRender === "Client" ? <> <h1 className="clientdata-head">Client Details</h1>
        <table className="main-table">
          <tr className="table-data">
            <th className="table-header">S.No</th>
            <th className="table-header">Name</th>
            <th className="table-header">E-mail</th>
            <th className="table-header">PhoneNumber</th>
            <th className="table-header">Location</th>
            <th className="table-header">Address</th>
            <th className="table-header">Delete</th>
            <th className="table-header">Forms</th>
            <th className="table-header">Data</th>
          </tr>
          {data.map((each, index) => {
            return (
              <tr key={each.id} className="tabledata-details">
                <td className="table-header">{index + 1}</td>
                <td className="table-header">{each.name}</td>
                <td className="table-header">{each.email}</td>
                <td className="table-header">{each.phonenumber}</td>
                <td className="table-header">{each.locaton}</td>
                <td className="table-header">{each.address}</td>
                <td className="table-header"><button onClick={() => deleteHandler(each.id)} className="delete-button" >Delete</button></td>
                <td className="table-header"><button onClick={() => onClickForms(each.email, each.name)} className="data-button">Forms</button></td>
                <td className="table-header"><button onClick={() => onClickData(each.email, each.name)} className="data-button">Data</button></td>
              </tr>
            );
          })}
        </table> </> : <>{pageRender === "Forms" ?
          <div>
            {renderClientData()}
          </div> : <div>
            {renderFormDetails()}
          </div>}</>}
    </>

  );
};

export default withRouter(ClientData);
