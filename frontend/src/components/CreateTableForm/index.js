import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import "./index.css"

const CreateTableForm = () => {
  const [tbName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: '' }]);
  const [submitted, setSubmitted] = useState(false); // State to track form submission

  const handleAddColumn = () => {
    setColumns([...columns, { name: '', type: '' }]);
  };

  const handleColumnNameChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].name = value;
    setColumns(updatedColumns);
  };

  const handleColumnTypeChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].type = value;
    setColumns(updatedColumns);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tableName = tbName.split(" ").join("")
    if (localStorage.getItem("candidateData")){
    const localCandidateData = JSON.parse(localStorage.getItem("candidateData"))
    const {name, email} = localCandidateData
    try {
      await axios.post('http://localhost:4000/create-table', { tableName, columns, name, email });
      alert('Table created successfully');
      setSubmitted(true); // Set submitted to true after successful submission
    } catch (error) {
      console.error('Error creating table:', error);
      alert('Error creating table');
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
        <h1 className='table-create-farm-heading'>Create Survey</h1>
        <input
          className='table-create-table-name-input'
          type="text"
          value={tbName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder='Enter Name of the Survey'
        />
        {columns.map((column, index) => (
          <div className='table-create-input-container' key={index}>
            <input
              className='table-create-add-column-input'
              type="text"
              value={column.name}
              onChange={(e) => handleColumnNameChange(index, e.target.value)}
              placeholder='Enter Name'
            />
            <select className='table-create-add-column-input' value={column.type} onChange={(e) => handleColumnTypeChange(index, e.target.value)} >
              <option value="">--Select Type---</option>
              <option value="INT">Number</option>
              <option value="VARCHAR(200)">Less Content Text</option>
              <option value="TEXT(300)">More Content Text</option>
              <option value="DATE">Date</option>
            </select>
          </div>
        ))}
        <div className='table-create-button-container'>
          <button type="button" className='table-create-add-column-button' onClick={handleAddColumn}>
            Add Column
          </button>
          <button type="submit" className='table-create-create-table-button'>Create Table</button>
        </div>
      </form>
    </div>
  );
};

export default CreateTableForm;
