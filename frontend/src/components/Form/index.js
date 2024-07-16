import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./index.css";
import baseUrl from "../config";
import ReactToPrint from "react-to-print";

const Form = () => {
    const [form, setForm] = useState({});
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [userData, setUserData] = useState({})
    const [nextButtonStatus, setNextButtonStatus] = useState(false)

    const choices = ['A', 'B', 'C', 'D', 'E', 'F'];
    const formRef = useRef(); // Create a ref to the form component

    const { formid } = useParams(); // Get the formId from the URL

    useEffect(() => {
        axios.get(`${baseUrl}form/` + formid)
            .then(res => {
                if (res.data.length !== 0) {
                    setForm(res.data[0]);
                    setQuestions(JSON.parse(res.data[0].questions));
                    console.log(JSON.parse(res.data[0].questions));
                }
                console.log(res.data[0]);
            })
            .catch(err => console.log(err));
    }, [formid]);

    const inputHandler = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setAnswers((prevState) => {
                const selectedOptions = prevState[name] || [];
                if (checked) {
                    return { ...prevState, [name]: [...selectedOptions, value] };
                } else {
                    return { ...prevState, [name]: selectedOptions.filter((option) => option !== value) };
                }
            });
        } else {
            setAnswers({ ...answers, [name]: value });
        }
    };

    const userInputHandler = (e) => {
        setUserData({...userData, [e.target.name]:e.target.value})
    }

    const onSubmitForm = (e) => {
        e.preventDefault();

        axios.post(`${baseUrl}response`, { answers, userData, formid })   
            .then(res => {
                alert('Form created successfully');
                setAnswers({});
            })
            .catch(err => alert('Error creating form'));
            window.location.reload();
    };

    const onSubmitUserDetails = (e) => {
        e.preventDefault();
        setNextButtonStatus(true)

    }

    const formDetails = () => {
        return (
            <div className="form-table-form-container">
            <form ref={formRef} onSubmit={onSubmitForm} className="forms-table-form">
                <div className="form-border-container">
                    <h1 className="form-title">{form.formname}</h1>
                    {questions.map((question, index) => {
                        if (question.type === "MCQ") {
                            return (
                                <div key={index} className="forms-table-form-container">
                                    <p className="forms-table-input-label">{index + 1}. {question.question}</p>
                                    <div className="options-container">
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex}>
                                                <span>{choices[optionIndex]}. </span>
                                                <input
                                                    type="radio"
                                                    name={`question_${index}`} // Use a unique identifier for the question
                                                    value={option}
                                                    onChange={inputHandler}
                                                    checked={answers[`question_${index}`] === option}
                                                />
                                                <label>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        } else if (question.type === "CheckBox") {
                            return (
                                <div key={index} className="forms-table-form-container">
                                    <p className="forms-table-input-label">{index + 1}. {question.question}</p>
                                    <div className="options-container">
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex}>
                                                <span>{choices[optionIndex]}. </span>
                                                <input
                                                    type="checkbox"
                                                    name={`question_${index}`} // Use a unique identifier for the question
                                                    value={option}
                                                    onChange={inputHandler}
                                                    checked={answers[`question_${index}`] && answers[`question_${index}`].includes(option)}
                                                />
                                                <label>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        } else if (question.type === "FIB") {
                            return (
                                <div key={index} className="forms-table-form-container">
                                    <p className="forms-table-input-label">{index + 1}.
                                        {question.question.split("_")[0]}
                                        <input
                                            type="text"
                                            name={`question_${index}`} // Use a unique identifier for the question
                                            value={answers[`question_${index}`] || ""}
                                            onChange={inputHandler}
                                            className="fill-in-the-bank-input"
                                        />
                                        {question.question.split("_")[1]}
                                    </p>
                                </div>
                            );
                        }
                        else if (question.type === "Coding") {
                            return (
                                <div key={index} className="forms-table-form-container">
                                    <p className="forms-table-input-label">{index + 1}. {question.question}</p>
                                    <textarea
                                        type="text"
                                        name={`question_${index}`} // Use a unique identifier for the question
                                        value={answers[`question_${index}`] || ""}
                                        onChange={inputHandler}
                                        cols={100}
                                        rows={20}
                                        className="coding-bank-input"
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    <button type="submit" className="forms-table-submit-button">Submit</button>
                </div>
            </form>
            <ReactToPrint
                trigger={() => <button className="print-button">Print PDF</button>}
                content={() => formRef.current}
            />
        </div>
        )
    }

    const userDetailsForm = () => {
        return (
        <form onSubmit={onSubmitUserDetails} className="user-form-container">
            <h1>Enter Details</h1>
            <input onChange={userInputHandler} className="user-input" name="name" type="text" placeholder="Enter Your Name" required/>
            <input onChange={userInputHandler} className="user-input" name="email" type="text" placeholder="Enter Your Email" required/>
            <input onChange={userInputHandler} className="user-input" name="phoneNo" type="text" placeholder="Enter Your Phone Number" required/>
            <button type="submit" className="forms-table-submit-button">Next</button>
        </form>
        )
    }

    return (
        <div className="form-table-form-container">
            {nextButtonStatus ? formDetails() : userDetailsForm()}
        </div>
    );
};

export default Form;
