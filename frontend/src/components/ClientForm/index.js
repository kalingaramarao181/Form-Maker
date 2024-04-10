import React, {useState, useEffect}from "react"
import axios from "axios"
import Cookies from "js-cookie"
import "./index.css"


const ClintForm = (props) => {
    const [formData, setFormData] = useState([])
    const [data, setData] = useState([])


    let tableName = "client"

    useEffect(() => {
        axios.get("http://localhost:4000/columns/"+tableName)
        .then(res => setFormData(res.data))
        .catch(err => console.log(err))
    }, [tableName])

    const inputHandler = (e) => {
        setData({...data,[e.target.name]:e.target.value})
    }

    const onSubmitForm = (e) => {
        e.preventDefault()
        axios.post("http://localhost:4000/signup/" + tableName, {...data})
        .then(res => {
            Cookies.set("jwtToken", res.data.token, {expires:15/1440})
            localStorage.setItem("candidateData", JSON.stringify(data))
            window.location.reload()
        })
        .catch(err => console.log(err))
    }
    return (
        <div className="form-table-client-form-container"> 
        <div>
            <img src="https://analytics.plunes.com/signup.png" alt="signup"/>
        </div>
            <form onSubmit={onSubmitForm} className="forms-table-form">
                <h1>Client Form</h1>
                {formData.map((eachData) => {
                    if (eachData.name === "id"){
                        return null
                    }
                    console.log(eachData.email)
                    
                    return (
                        <div className="forms-table-form-container">
                            <label className="forms-table-input-label">{eachData.name}:</label>
                            {eachData.type === "text" ? <textarea value={data[eachData.name]} onChange={inputHandler} cols={30} rows={6} className="forms-table-name-input" type={eachData.type} name={eachData.name} placeholder={`Enter ${eachData.name}`}/> :
                            <input value={data[eachData.name]} name={eachData.name} onChange={inputHandler} className="forms-table-name-input" type={eachData.type} placeholder={`Enter ${eachData.name}`}/>}
                        </div>
                    )
                })}
                <button type="submit" className="forms-table-submit-button">Submit</button>
            </form>
        </div>
    )
}

export default ClintForm