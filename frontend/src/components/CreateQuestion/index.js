import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import "./index.css";
import baseUrl from '../config';

const CreateQuestion = () => {
  const [tbName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ type: '', question: '', options: [''], answer: '' }]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleAddColumn = () => {
    setColumns([...columns, { type: '', question: '', options: [''], answer: '' }]);
  };

  const handleRemoveColumn = (index) => {
    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);
  };

  const handleQuestionTypeChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].type = value;
    setColumns(updatedColumns);
  };

  const handleQuestionChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].question = value;
    setColumns(updatedColumns);
  };

  const handleOptionChange = (columnIndex, optionIndex, value) => {
    const updatedColumns = [...columns];
    updatedColumns[columnIndex].options[optionIndex] = value;
    setColumns(updatedColumns);
  };

  const handleAddOption = (columnIndex) => {
    const updatedColumns = [...columns];
    updatedColumns[columnIndex].options.push('');
    setColumns(updatedColumns);
  };

  const handleAnswerChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].answer = value;
    setColumns(updatedColumns);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tableName = tbName.split(" ").join("");
    if (localStorage.getItem("candidateData")) {
      const localCandidateData = JSON.parse(localStorage.getItem("candidateData"));
      const { name, email } = localCandidateData;

      const formData = new FormData();
      formData.append('tableName', tableName);
      formData.append('columns', JSON.stringify(columns));
      formData.append('name', name);
      formData.append('email', email);
      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      console.log(...formData);

      try {
        await axios.post(`${baseUrl}create-form`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Form created successfully');
        setSubmitted(true);
      } catch (error) {
        console.error('Error creating form:', error);
        alert('Error creating form');
      }
    }
  };

  if (submitted) {
    return (
      <div className='table-create-farm-container'>
        <h1>Form created successfully!</h1>
        <h1>Thank You</h1>
        <Link to="/create-form"><button className='create-form-ok-button' onClick={() => window.location.reload()}>Ok</button></Link>
      </div>
    );
  }

  return (
    <div className='table-create-farm-container'>
      <form onSubmit={handleSubmit} className='table-create-farm'>
        <h1 className='table-create-farm-heading'>Create Question Form</h1>
        <div className='form-name-container'>
          <input
            className='form-name-input'
            type="text"
            value={tbName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder='Enter Name of the Survey'
          />
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="file-input-label">
            Add Logo
          </label>
          {selectedFile && (
            <div>
              {previewUrl && (
                <img src={previewUrl} alt="Preview" style={{ width: '4vh', marginTop: '5px' }} />
              )}
            </div>
          )}
        </div>
        {columns.map((column, columnIndex) => (
          <div className='table-create-input-container' key={columnIndex}>
            <select
              className='select-options-input'
              value={column.type}
              onChange={(e) => handleQuestionTypeChange(columnIndex, e.target.value)}
            >
              <option value="">--Select Question Type---</option>
              <option value="MCQ">MCQ</option>
              <option value="CheckBox">Check Box</option>
              <option value="FIB">Fill In the blanks</option>
              <option value="Coding">Coding Question</option>
            </select>
            {column.type && (
              <div className='question-container'>
                <input
                  className='form-question-input'
                  type="text"
                  placeholder='Enter Question'
                  value={column.question}
                  onChange={(e) => handleQuestionChange(columnIndex, e.target.value)}
                />
                {column.type === 'FIB' && (
                  <div style={{ position: 'relative' }}>
                    <p style={{ color: 'red', position: 'absolute', bottom: '-20px', right: '0' }}>
                      Give _ in the dash position
                    </p>
                  </div>
                )}
                {(column.type === 'MCQ' || column.type === 'CheckBox') && (
                  <div className='options-container'>
                    {column.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        className='option-input'
                        placeholder={`Option ${optionIndex + 1}`}
                        type='text'
                        value={option}
                        onChange={(e) => handleOptionChange(columnIndex, optionIndex, e.target.value)}
                      />
                    ))}
                    <button
                      type="button"
                      className='add-option-button'
                      onClick={() => handleAddOption(columnIndex)}
                    >
                      + Option
                    </button>
                  </div>
                )}
                {column.type && (
                  <input
                    className='form-answer-input'
                    type="text"
                    placeholder='Enter Correct Answer'
                    value={column.answer}
                    onChange={(e) => handleAnswerChange(columnIndex, e.target.value)}
                  />
                )}
                <button
                  type="button"
                  className='remove-question-button'
                  onClick={() => handleRemoveColumn(columnIndex)}
                >
                  Remove Question
                </button>
              </div>
            )}
          </div>
        ))}
        <div className='table-create-button-container'>
          <button type="button" className='table-create-add-column-button' onClick={handleAddColumn}>
            Add Question
          </button>
          <button type="submit" className='table-create-create-table-button'>Create Form</button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
