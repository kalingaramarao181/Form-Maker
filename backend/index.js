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

const app = express();
app.use(bodyParser.json());
app.use(cors());

//GENARATE FORM UNIQUEID
function generateFormId() {
  return uuidv4(); // Generate a UUID
}

//GENARATE RESPONSE UNIQUEID
function generateResponseId() {
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

const tokens = {}; // Object to store token usage count


//TOKEN GENERATION FOR USER ATHANTICATION
function generateToken(payload) {
  const token = jwt.sign(payload, 'SECRET_KEY');
  tokens[token] = 0;
  return token;
}
// VALIDATION FOR USER ATHANTICATION
function validateToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }
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
}

//DATABASE CONNECTION
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'formcreation'
});

//PROTECTION FOR USER
app.get('/protected-route', validateToken, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!tokens[token]) {
    return res.json({ error: "Token no longer valid" });
  }
  return res.json({ message: 'Protected route accessed' });
});

//GET ALL FORMS (FORMS)
app.get("/all-forms", (req, res) => {
  const email = req.params.email;
  const sql = 'SELECT formid, formname FROM forms';
  pool.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

//GET ALL RESPONSES(FORMS, RESPONSES)
app.get("/all-responses", (req, res) => {
  const sql = 'SELECT f.formid, f.formname, COUNT(*) AS formcount FROM responses r JOIN forms f ON r.formid = f.formid GROUP BY r.formid'
  pool.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  });
});

//GET FORM RESPONSES WITH FORMID
app.get("/form-responses/:formid", (req, res) => {
  const formid = req.params.formid;
  const sql = 'SELECT * FROM responses WHERE formid = ?'
  pool.query(sql,[formid], (err, data) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(data);
  }); 
});

//GET FORM WITH FORMID (FORMS)
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

//GET RESPONSE WITH FORMID AND RESPONSEID (FORMS, RESPONSES)
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

//GET RESPONSES WITH FORMID (RESPONSES)
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


//GET USER DATA (CLIENT)
app.get("/client-data", (req, res) => {
  const sql = "SELECT * FROM client";
  pool.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//CREATING FORM (FORMS)
app.post('/create-form', upload.single('logo'), async (req, res) => {
  const { tableName, columns } = req.body;
  const formId = generateFormId();
  const userEmail = "beedata@gmail.com";
  const logo = req.file ? req.file.filename : null;
  const formData = {
    formid: formId,
    useremail: userEmail,
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
      res.status(201).json({ message: 'Form created successfully', formId });
      console.log('Form created successfully');
    });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//POST USER RESPONSE (RESPONSES)
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
      res.status(201).json({ message: 'Response send successfully' });
      console.log('Response send successfully');
    });
  } catch (error) {
    console.error('Error sending response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//USER SIGNUP (CLIENT)
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

//ADMIN LOGIN (ADMINFORM)
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
      res.json({ jwtToken });
      res.status(200);
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  });
});

//DELETE CLIENT (CLIENT)
app.delete("/delete-client/:id", (req, res) => {
  const sql = "DELETE FROM client WHERE id = (?)";
  const id = [req.params.id];
  pool.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


module.exports = function (app) {
  app.use('/api', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));
};

app.listen(4000, () => {
  console.log(`Server is running on port http://localhost:4000`);
});
