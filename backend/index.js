const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require("cors")
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(bodyParser.json());
app.use(cors())

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'formcreation'
});

app.post('/create-table', (req, res) => {
    const { tableName, columns } = req.body;
  
    // Validate input
    if (!tableName || !columns || !Array.isArray(columns)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    let createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName}form (`;
    createTableQuery += `id INT AUTO_INCREMENT PRIMARY KEY, `; // Add id column
  
    columns.forEach((column, index) => {
      if (!column.name || !column.type) {
        return res.status(400).json({ error: 'Invalid column' });
      }
      createTableQuery += `${column.name} ${column.type}`;
      if (index < columns.length - 1) {
        createTableQuery += ', ';
      }
    });
  
    createTableQuery += ')';
  
    pool.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating table:', err);
        return res.status(500).json({ error: 'Error creating table' });
      }
      console.log(`${tableName} table created or already exists`);
      res.status(200).json({ message: `${tableName} table created or already exists` });
    });
  });

  //GET TABLES FROM DATABASE
  app.get("/tables", (req, res) => {
    const sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = ?";
    const databaseName = pool.config.connectionConfig.database;

    pool.query(sql, [databaseName], (err, data) => {
        if (err) {
            console.error('Error fetching tables:', err);
            return res.status(500).json({ error: 'Error fetching tables' });
        }

        // Extract table names from the results
        const tables = data.map(row => row.table_name);

        // Send table names as JSON in the response
        return res.json(tables);
    });
});


app.post("/post-to/:tableName", (req, res) => {
  const tableName = req.params.tableName
  const {...data} = req.body
  const keys = Object.keys(data)
  const values = Object.values(data)
  const sql = `INSERT INTO ${tableName} (${keys.map((each) => "`"+each+"`")}) VALUES (?)`
  pool.query(sql, [values], (err,data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
  console.log(values)

})

//GET COLUMNS FROM TABLE
app.get("/columns/:tableName", (req, res) => {
    const tableName = req.params.tableName;
    const sql = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ?";

    pool.query(sql, [tableName], (err, data) => {
        if (err) {
            console.error('Error fetching columns:', err);
            return res.status(500).json({ error: 'Error fetching columns' });
        }

        // Extract column names and types from the results
        const columns = data.map(row => ({
            name: row.column_name,
            type: row.data_type
        }));

        // Send columns as JSON in the response
        return res.json(columns);
    });
});

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



module.exports = function(app) {
  app.use('/api', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));
};

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
