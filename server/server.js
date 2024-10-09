const express = require('express');
const cors = require('cors');
const pool = require('./database'); // Import the MySQL connection
const app = express();
const port = 3060;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Endpoint to add a new person
app.post('/api/add-person', (req, res) => {
  const { name, email, phone, address } = req.body;

  if (name && email && phone && address) {
    const query = 'INSERT INTO persons (name, email, phone, address) VALUES (?, ?, ?, ?)';
    pool.query(query, [name, email, phone, address], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ message: 'Database error', error: err });
      } else {
        res.status(201).json({ message: 'Person added successfully', personId: result.insertId });
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Endpoint to get all persons
app.get('/api/people', (req, res) => {
  const query = 'SELECT * FROM persons'; 

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'Database error', error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// Endpoint to delete a person by ID
app.delete('/api/people/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const query = 'DELETE FROM persons WHERE id = ?';
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting person:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.status(200).json({ message: `Person with id ${id} deleted successfully` });
  });
});


// Endpoint to update a person by ID
app.put('/api/people/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  if (name && email && phone && address) {
    const query = 'UPDATE persons SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
    pool.query(query, [name, email, phone, address, id], (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ message: 'Database error', error: err });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Person not found' });
      } else {
        res.status(200).json({ message: 'Person updated successfully' });
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid data' });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
  pool.connect(function(err){
    if(err) throw err;
    console.log('Database connected!');
  });
});
