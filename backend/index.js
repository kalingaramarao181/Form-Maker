const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Generate Form Unique ID
function generateFormId() {
  return uuidv4();
}

// Generate Response Unique ID
function generateResponseId() {
  return uuidv4();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const tokens = {}; // Object to store token usage count

// Token Generation for User Authentication
function generateToken(payload) {
  const token = jwt.sign(payload, 'SECRET_KEY');
  tokens[token] = 0;
  return token;
}

// Validation for User Authentication
const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    // Assuming tokens is a global object or use a persistent store
    if (!tokens[token]) {
      tokens[token] = 0;
    }

    if (tokens[token] >= 6) {
      return res.status(401).json({ error: 'Token usage limit exceeded' });
    }

    tokens[token]++;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Database Connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'formcreation'
});

// Protection for User
app.get('/protected-route', validateToken, (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!tokens[token]) {
    return res.status(401).json({ error: 'Token no longer valid' });
  }

  res.json({ message: 'Protected route accessed' });
});

// Get All Forms (Forms)
app.get("/all-forms", (req, res) => {
  const sql = 'SELECT formid, formname FROM forms';
  pool.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

// Get All Responses (Forms, Responses)
app.get("/all-responses", (req, res) => {
  const sql = 'SELECT f.formid, f.formname, COUNT(*) AS formcount FROM responses r JOIN forms f ON r.formid = f.formid GROUP BY r.formid';
  pool.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

// Get Form Responses with FormID
app.get("/form-responses/:formid", (req, res) => {
  const formid = req.params.formid;
  const sql = 'SELECT * FROM responses WHERE formid = ?';
  pool.query(sql, [formid], (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

// Get Form with FormID (Forms)
app.get("/form/:formid", (req, res) => {
  const formid = req.params.formid;
  const sql = 'SELECT * FROM forms WHERE formid = ?';
  pool.query(sql, [formid], (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

// Get Response with FormID and ResponseID (Forms, Responses)
app.get("/response-form/:formid/:responseid", (req, res) => {
  const formid = req.params.formid;
  const responseid = req.params.responseid;
  const sql = 'SELECT * FROM responses INNER JOIN forms ON responses.formid = forms.formid WHERE responses.responseid = ? AND forms.formid = ?';
  pool.query(sql, [responseid, formid], (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

// Get Responses with FormID (Responses)
app.get("/response-data/:formid", (req, res) => {
  const formid = req.params.formid;
  const sql = 'SELECT * FROM responses WHERE formid = ?';
  pool.query(sql, [formid], (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log(data[0].answers);
    return res.json(JSON.parse(data[0].answers));
  });
});

// Get User Data (Client)
app.get("/client-data", (req, res) => {
  const sql = "SELECT * FROM client";
  pool.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Creating Form (Forms)
app.post('/create-form', upload.single('logo'), async (req, res) => {
  const { tableName, columns, userdetails } = req.body;
  const formId = generateFormId(); // Generate a unique formId
  const logo = req.file ? req.file.filename : "";

  const formData = {
    formid: formId,
    userdetails: userdetails,
    formname: tableName,
    questions: columns,
    logo: logo
  };

  const query = 'INSERT INTO forms SET ?';

  try {
    pool.query(query, formData, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Respond with the success message and formId
      res.status(201).json({
        message: 'Form created successfully',
        formId: formId // Send formId in the response
      });
    });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Post User Response (Responses)
app.post("/response", (req, res) => {
  const { answers, userData, formid } = req.body;
  const responseid = generateResponseId();
  const responseData = {
    formid,
    responseid,
    useremail: userData.email,
    answers: JSON.stringify(answers),
    userdata: JSON.stringify(userData),
  };
  const query = 'INSERT INTO responses SET ?';
  try {
    pool.query(query, responseData, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(201).json({ message: 'Response sent successfully' });
      console.log('Response sent successfully');
    });
  } catch (error) {
    console.error('Error sending response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Signup (Client)
app.post("/signup-user", (req, res) => {
  const { name, email, phoneno, location, address } = req.body;
  const dbsql = 'SELECT * FROM client WHERE email = ?';
  const postsql = 'INSERT INTO client (`name`, `email`, `phoneno`, `location`, `address`) VALUES (?)';
  const values = [name, email, phoneno, location, address];
  pool.query(dbsql, [email], (err, data) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    if (data.length > 0) {
      console.error('User already exists');
      res.status(409).json({ error: 'User Already Exists' });
      return;
    }
    pool.query(postsql, [values], (err, result) => {
      if (err) {
        console.error('Database insertion error:', err);
        res.status(500).json({ error: 'Database insertion error' });
        return;
      }
      console.log('Data inserted successfully');
      res.status(201).json({ message: 'Application submitted successfully' });
    });
  });
});

// Admin Login (AdminForm)
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM adminform WHERE email = '${username}'`;
  pool.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (data.length === 0) {
      return res.status(400).json({ error: "Invalid user" });
    } else if (data[0].password === password) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "SECRET_TOKEN");
      res.json({ jwtToken, userData: data });
      res.status(200);
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  });
});

// Delete Client (Client)
app.delete("/delete-client/:id", (req, res) => {
  const sql = "DELETE FROM client WHERE id = (?)";
  const id = [req.params.id];
  pool.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Middleware to proxy frontend requests to the backend
app.use('/api', createProxyMiddleware({ target: 'http://form-maker.bedatatech.com', changeOrigin: true }));

app.post('/send-email', upload.single('file'), (req, res) => {
  const { email, name, questions, currectAnswers } = req.body;
  const filePath = req.file.path;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // or 587 for TLS
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'bdtemployeestatus@gmail.com',
      pass: 'pmjwjulscjvelncd'
    }
  });

  const options = {
    from: 'bdtemployeestatus@gmail.com',
    to: email,
    subject: "Results PDF",
    text: "Please find the attached PDF containing your form responses.",
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
      
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
      
          .logo {
            max-width: 100%;
            height: auto;
          }
      
          .content {
            text-align: justify;
            margin-bottom: 20px;
          }
      
          .button {
            display: inline-block;
            padding: 10px 20px;
            text-decoration: none;
            background-color: #3498db;
            color: #ffffff;
            border-radius: 3px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://beedatatech.com/01_Important_Documents/RecoF-1.png" alt="Company Logo">
            <h1>RECO FORM</h1>
          </div>
      
          <div class="content">
            <p>
              Hello ${name},
            </p>
            <p>
              You Got ${currectAnswers} Out of ${questions}.<br/>
            </p>
          </div>
        </div>
      </body>
      </html>`,
    attachments: [
      {
        filename: 'response.pdf',
        path: filePath,
        contentType: 'application/pdf'
      }
    ]
  };

  transporter.sendMail(options, function (err, success) {
    if (err) {
      response.json(err);
    } else {
      response.json("Successfully Send");
    }
  });
});

app.listen(4000, () => {
  console.log(`Server is running on port http://form-maker-back.bedatatech.com`);
});
