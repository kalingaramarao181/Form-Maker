import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import "./index.css";
import baseUrl from '../config';

const CreateQuestion = () => {
  const [tbName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ type: '', question: '', options: [''], answer: '' }]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [formLink, setFormLink] = useState('');
  const [setFormId] = useState('');

  const candidateData = localStorage.getItem("candidateData") || null;
  const qrCodeCanvasRef = useRef(null);

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

  const mapAnswerToOption = (column) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const answers = column.answer.split(',').map(answer => answer.trim().toUpperCase());
    return answers.map(answer => {
      const index = alphabet.indexOf(answer);
      return column.options[index] || '';
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tableName = tbName.split(" ").join("");
    if (localStorage.getItem("candidateData")) {
      const formattedColumns = columns.map(column => ({
        ...column,
        answer: (column.type === 'MCQ' || column.type === 'CheckBox') ? mapAnswerToOption(column) : column.answer
      }));

      const formData = new FormData();
      formData.append('tableName', tableName);
      formData.append('columns', JSON.stringify(formattedColumns));
      formData.append('userdetails', candidateData);
      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      try {
        const response = await axios.post(`${baseUrl}create-form`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const { formId } = response.data; // Assuming formId is returned in the response
        const link = `http://localhost:3000/form/${formId}`; // Generate the form link
        setFormLink(link);
        setFormId(formId);
        setSubmitted(true);
      } catch (error) {
        console.error('Error creating form:', error);
        alert('Error creating form');
      }
    }
  };

  const drawQRCode = () => {
    const canvas = qrCodeCanvasRef.current;
    const context = canvas.getContext('2d');

    // Set the background color to white
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the QR code on top
    const qrCodeCanvas = document.getElementById('qrCode');
    const qrCodeSize = 128; // Size of the QR code

    // Calculate the position to center the QR code
    const qrCodeX = (canvas.width - qrCodeSize) / 2;
    const qrCodeY = (canvas.height - qrCodeSize) / 2;

    context.drawImage(qrCodeCanvas, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

    // Add heading
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText('Scan the QR Code', canvas.width / 2, qrCodeY - 30);

    // Add description
    context.font = '18px Arial';
    context.fillText('Use your phone to scan the QR code ', canvas.width / 2, qrCodeY + qrCodeSize + 30);

  };

  useEffect(() => {
    if (submitted) {
      drawQRCode();
    }
  }, [submitted]);

  const downloadQRCode = () => {
    const canvas = qrCodeCanvasRef.current;
    if (canvas) {
      const img = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = img;
      link.download = 'qr_code.png';
      link.click();
    }
  };

  if (submitted) {
    return (
      <div className='table-create-farm-container'>
        <h1 className='success-head'>Form created successfully!</h1>
        <h1 className='success-head'>Thank You</h1>
        <QRCode id="qrCode" value={formLink} size={128} style={{ display: 'none' }} />
        <canvas ref={qrCodeCanvasRef} width={400} height={400} />
        <p>{formLink}</p>
        <div className='success-button-container'>
          <button className='download-qr-button' onClick={downloadQRCode}>Download QR Code</button>
          <Link to="/create-form"><button className='create-form-ok-button' onClick={() => window.location.reload()}>Ok</button></Link>
        </div>
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
                <input
                  className='form-answer-input'
                  placeholder='Enter Answer'
                  type="text"
                  value={column.answer}
                  onChange={(e) => handleAnswerChange(columnIndex, e.target.value)}
                />
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
          <button className='table-create-add-column-button' type="button" onClick={handleAddColumn}>
            Add Question
          </button>
          <button className='table-create-create-table-button' type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
