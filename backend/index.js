const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require("cors")
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

const app = express();  
app.use(bodyParser.json());
app.use(cors())

function generateFormId() {
  return uuidv4(); // Generate a UUID
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


function generateUniqueThreeDigitNumber() {
  // Generate a random number between 0 and 999
  const randomNumber = crypto.randomInt(1000);

  // Ensure the number is exactly 3 digits
  const uniqueNumber = randomNumber.toString().padStart(3, '0');

  return uniqueNumber;
}

const tokens = {}; // Object to store token usage count


// Function to generate JWT token with limited usage count
function generateToken(payload) {
  const token = jwt.sign(payload, 'SECRET_KEY'); // Set expiration time as needed
  tokens[token] = 0;
  return token;
}

// Middleware to validate JWT token
function validateToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }
    
    if (!tokens[token]) {
      tokens[token] = 0; // Initialize token count if it doesn't exist
    }

    if (tokens[token] >= 6) {
      return res.status(401).json({ error: 'Token usage limit exceeded' });
    }
    
    tokens[token]++;
    next(); 
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

//DATABASE CONNECTION OBJECT
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'formcreation'
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GET API'S


// PROTECTED ROUTE
app.get('/protected-route', validateToken, (req, res) => {
  // Your protected route logic here
  const token = req.headers.authorization.split(' ')[1];
  if (!tokens[token]){
    return res.json({error: "Token no longer valid"})
  }
  return res.json({ message: 'Protected route accessed' });
});


//GET ALL FORMS
app.get("/all-forms", (req, res) => {
  const email = req.params.email;
  const sql = 'SELECT formid, formname FROM  forms';
  pool.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

//GET FORM
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



//GET CANDIDATE DATA USING EMAIL
app.get("/candidate-data/:email", (req, res) => {
  const email = req.params.email;
  const sql = 'SELECT tableid FROM forminfrormativedata WHERE email = ?';
  pool.query(sql, [email], (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

//GET CLIENT DATA
app.get("/client-data", (req, res) => {
  const sql = "SELECT * FROM client"
  pool.query(sql, (err, data) => {
    if(err) return res.json(err)
    return res.json(data)
  })
})





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//POST API'S


//CREATE FORM API NEW
app.post('/create-form', upload.single('logo'), async (req, res) => {
  const { tableName, columns } = req.body;
  const formId = generateFormId();
  const userEmail = "beedata@gmail.com"; 
  const logo = req.file ? req.file.filename : null;

  const formData = {
    formid: formId,
    useremail: userEmail,
    formname: tableName,
    questions: JSON.stringify(columns),
    logo: logo
  };

  const query = 'INSERT INTO forms SET ?';

  try {
    await pool.query(query, formData);
    res.status(201).json({ message: 'Form created successfully', formId });
    console.log('Form created successfully');
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//POST SURVEY DATA FROM SELECTOD FORM
app.post("/post-to/:tableName", (req, res) => {
  const tableName = req.params.tableName
  const { ...data } = req.body
  const keys = Object.keys(data)
  const values = Object.values(data)
  const sql = `INSERT INTO ${tableName} (${keys.map((each) => "`" + each + "`")}) VALUES (?)`
  pool.query(sql, [values], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


//POST SURVEY DATA FROM SELECTOD FORM
app.post("/signup/:tableName", (req, res) => {
  const tableName = req.params.tableName
  const {email} = req.body
  const { ...data } = req.body
  const keys = Object.keys(data)
  const values = Object.values(data)
  const sql = `INSERT INTO ${tableName} (${keys.map((each) => "`" + each + "`")}) VALUES (?)`
  const token = generateToken({ userId: email });
  pool.query(sql, [values], (err, data) => {
    if (err) return res.json(err)
    return res.json({ token });
  })
})

//POST ADMIN LOGIN
app.post("/admin-login", (req, res) => {
  const {username, password} = req.body
  const sql = `SELECT * FROM adminform WHERE email = '${username}'`
  pool.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error" }); // Handle database error
    }
    if (data.length === 0) { // Check if user is not found
      return res.status(400).json({ error: "Invalid user" });
    }
    else if (data[0].password === password){
      const payload = {username: username}
      const jwtToken = jwt.sign(payload, "SECRET_TOKEN")
      res.json({jwtToken})
      res.status(200)
    }else{
      res.status(400).json({ error: "Invalid Password" })
    }
  })
})


//DELETE CLIENT
app.delete("/delete-client/:id", (req, res) => {
  const sql = "DELETE FROM client WHERE id = (?)"
  const id = [req.params.id]
  pool.query(sql, [id], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


app.get("/dummy", (req, res) => {
  const sql = "SELECT * FROM dummy";
  pool.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching data from dummy table:', err);
      return res.status(500).json({ error: 'Error fetching data from dummy table' });
    }
    return res.json(data);
  });
});

module.exports = function (app) {
  app.use('/api', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));
};

//RUNNIG SURVER
app.listen(4000, () => {
  console.log(`Server is running on port http://localhost:4000`);
});


