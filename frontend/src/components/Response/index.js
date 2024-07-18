import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import baseUrl from "../config";
import ReactToPrint from "react-to-print";
import "./index.css"

const Response = () => {
    const [form, setForm] = useState({});
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [userData, setUserData] = useState({})
    const choices = ['A', 'B', 'C', 'D', 'E', 'F'];
    const formRef = useRef(); // Create a ref to the form component

    const { formid, responseid } = useParams(); // Get the formId from the URL

    useEffect(() => {
        axios.get(`${baseUrl}response-form/${formid}/${responseid}`)
            .then(res => {
                if (res.data.length !== 0) {
                    setForm(res.data[0]);
                    setQuestions(JSON.parse(res.data[0].questions));
                    setAnswers(JSON.parse(res.data[0].answers));
                    setUserData(JSON.parse(res.data[0].userdata));
                }
                console.log(res.data[0]);
            })
            .catch(err => console.log(err));
    }, [formid, responseid]);

    const isCorrectAnswer = (question, option) => {
        if (question.type === "MCQ") {
            return question.answer.includes(option);
        } else if (question.type === "CheckBox") {
            return question.answer.includes(option);
        }
        return false;
    };

    const calculateCorrectAnswers = () => {
        let correctCount = 0;
        questions.forEach((question, index) => {
            if (question.type === "MCQ") {
                if (isCorrectAnswer(question, answers[`question_${index}`])) {
                    correctCount++;
                }
            } else if (question.type === "CheckBox") {
                const selectedOptions = answers[`question_${index}`] || [];
                if (selectedOptions.every(option => isCorrectAnswer(question, option)) &&
                    selectedOptions.length === question.answer.length) {
                    correctCount++;
                }
            } else if (question.type === "FIB") {
                if (answers[`question_${index}`] === question.answer) {
                    correctCount++;
                }
            }
        }); 
        return correctCount;
    };

    const correctAnswersCount = calculateCorrectAnswers();

    return (
        <div className="form-table-form-container">
            <form ref={formRef} className="forms-table-form">
                <div className="form-border-container">
                    <h1 className="form-title">{form.formname}</h1>
                    {questions.map((question, index) => {
                        if (question.type === "MCQ") {
                            return (
                                <div key={index} className="forms-table-form-container">
                                    <p className="forms-table-input-label">{index + 1}. {question.question}</p>
                                    <div className="options-container">
                                        {question.options.map((option, optionIndex) => {
                                            const isChecked = answers[`question_${index}`] === option;
                                            const isCorrect = isCorrectAnswer(question, option);
                                            const optionClass = isChecked ? (isCorrect ? "correct-option" : "incorrect-option") : "";
                                            return (
                                                <div key={optionIndex} className={`option ${optionClass}`}>
                                                    <span>{choices[optionIndex]}. </span>
                                                    <input
                                                        type="radio"
                                                        name={`question_${index}`} // Use a unique identifier for the question
                                                        value={option}
                                                        checked={isChecked}
                                                        readOnly
                                                    />
                                                    <label>{option}</label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        } else if (question.type === "CheckBox") {
                            return (
                                <div key={index} className="forms-table-form-container">
                                    <p className="forms-table-input-label">{index + 1}. {question.question}</p>
                                    <div className="options-container">
                                        {question.options.map((option, optionIndex) => {
                                            const isChecked = answers[`question_${index}`] && answers[`question_${index}`].includes(option);
                                            const isCorrect = isCorrectAnswer(question, option);
                                            const optionClass = isChecked ? (isCorrect ? "correct-option" : "incorrect-option") : "";
                                            return (
                                                <div key={optionIndex} className={`option ${optionClass}`}>
                                                    <span>{choices[optionIndex]}. </span>
                                                    <input
                                                        type="checkbox"
                                                        name={`question_${index}`} // Use a unique identifier for the question
                                                        value={option}
                                                        checked={isChecked}
                                                        readOnly
                                                    />
                                                    <label>{option}</label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        } else if (question.type === "FIB") {
                            const isCorrect = answers[`question_${index}`] === question.answer;
                            const inputClass = isCorrect ? "correct-option" : "incorrect-option";
                            return (
                                <div key={index} className="forms-table-form-container">
                                    <p className="forms-table-input-label">{index + 1}.
                                        {question.question.split("_")[0]}
                                        <input
                                            type="text"
                                            name={`question_${index}`} // Use a unique identifier for the question
                                            value={answers[`question_${index}`] || ""}
                                            className={`fill-in-the-blank-input ${inputClass}`}
                                            readOnly
                                        />
                                        {question.question.split("_")[1]}
                                    </p>
                                </div>
                            );
                        } else if (question.type === "Coding") {
                            return (
                                <div key={index} className="forms-table-form-container">
                                    <p className="forms-table-input-label">{index + 1}. {question.question}</p>
                                    <textarea
                                        name={`question_${index}`} // Use a unique identifier for the question
                                        value={answers[`question_${index}`] || ""}
                                        cols={100}
                                        rows={20}
                                        className="coding-bank-input"
                                        readOnly
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    <p className="correct-answers-count"><span className="user-name">{userData.name}</span>: <span className="user-name">{correctAnswersCount}</span> out of <span className="user-name">{questions.length}</span></p>
                </div>
            </form>
            <ReactToPrint
                trigger={() => <button className="print-button">Print PDF</button>}
                content={() => formRef.current}
            />
        </div>
    );
};

export default Response;
