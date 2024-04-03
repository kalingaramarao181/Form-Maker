import React, {useState, useEffect}from "react"
import axios from "axios"
import "./index.css"

const Form = () => {
    const [formData, setFormData] = useState([])
    const [data, setData] = useState({})

    let tableName = localStorage.getItem("tableName")

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
        axios.post("http://localhost:4000/post-to/" + tableName, {...data})
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }
    return (
        <div className="form-table-form-container">
            <form onSubmit={onSubmitForm} className="forms-table-form">
                <h1>{tableName.slice(0, tableName.length - 4).charAt(0).toUpperCase() + tableName.slice(0, tableName.length - 4).substr(1).toLowerCase() + " Form"}</h1>
                {formData.map((eachData) => {
                    if (eachData.name === "id"){
                        return null
                    }
                    return (
                        <div className="forms-table-form-container">
                            <label className="forms-table-input-label">{eachData.name}:</label>
                            {eachData.type === "text" ? <textarea onChange={inputHandler} cols={30} rows={6} className="forms-table-name-input" type={eachData.type} name={eachData.name} placeholder={`Enter ${eachData.name}`}/> :
                            <input name={eachData.name} onChange={inputHandler} className="forms-table-name-input" type={eachData.type} placeholder={`Enter ${eachData.name}`}/>}
                        </div>
                    )
                })}
                <button type="submit" className="forms-table-submit-button">Submit</button>
            </form>
        </div>
    )
}

export default Form