import React, { useState } from 'react';
import './index.css';
import axios from 'axios';

function SwapCards() {
    const [showBox1, setShowBox1] = useState("");
    const [tbName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: '' }]);

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
    try {
      await axios.post('http://localhost:4000/create-table', { tableName, columns });
      alert('Table created successfully');
      window.location.reload()
    } catch (error) {
      console.error('Error creating table:', error);
      alert('Error creating table');
    }
    setTableName('')
    setColumns([{ name: '', type: '' }])

  };

    const handleSwipe = () => {
        setShowBox1("rotateY(-180deg)");
    };
    console.log("Swap Cards")

    return (
        <div className='main-container'>
            <div class="flip-card">
                <div style={{transform:showBox1}} class="flip-card-inner">
                    <div class="flip-card-front">
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
                    <div class="flip-card-back">
                        <h1>John Doe</h1>
                        <p>Architect & Engineer</p>
                        <p>We love that guy</p>
                    </div>
                   
                </div>
                <button onClick={handleSwipe} className=''>Flip to back</button>
            </div>
        </div>
    );
}

export default SwapCards;
