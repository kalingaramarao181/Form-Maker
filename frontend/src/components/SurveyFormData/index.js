
import React, {useState, useEffect} from "react"
import "./index.css"
import axios from "axios"
import baseUrl from "../config"


const SurveyFormData = () => {

    const [data, setData] = useState([])
    const tableName = localStorage.getItem("tableName")

    useEffect(() => {
        axios.get(`${baseUrl}survey-form-data/` + tableName)
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    })

    return (
        <div className="servey-form-details-container">
            <h1 className="servey-form-details-heading"><span  className="servey-form-details-heading-span">{ tableName.slice(0,tableName.length - 4).charAt(0).toUpperCase()+ tableName.slice(0, tableName.length - 4).substr(1).toLowerCase()}</span> Survey Details:</h1>
            <div  className="survey-form-data-card-container">
            {data.length === 0 ? <p>No Data Found</p>:
            data.map((each) => {
                const names = Object.entries(each)
                return <div className="survey-form-data-card">
                    <h3>{names[1][1]}</h3>
                    {names.slice(2).map(([key, value]) => {
                        return (
                                <p className="survey-form-data-name"><span className="survey-form-data-span-name">{key}:</span> {value}</p>
                        )
                    })}
                    </div>
            })

        }
        </div>
        </div>
    )
}

export default SurveyFormData