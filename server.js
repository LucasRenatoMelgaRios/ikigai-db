require('dotenv').config(); // Asegúrate de que este módulo esté al principio
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Conectar a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', // Lee desde variables de entorno
    user: process.env.DB_USER || 'root', // Lee desde variables de entorno
    password: process.env.DB_PASSWORD || '', // Lee desde variables de entorno
    database: process.env.DB_NAME || 'manga_db' // Lee desde variables de entorno
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// CRUD Operations

// Obtener todas las series
app.get('/api/series', (req, res) => {
    db.query('SELECT * FROM series', (err, results) => {
        if (err) {
            console.error('Error fetching series:', err);
            res.status(500).json({ error: 'Error fetching series' });
            return;
        }
        res.json(results);
    });
});

// Obtener una serie por ID
app.get('/api/series/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM series WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching series:', err);
            res.status(500).json({ error: 'Error fetching series' });
            return;
        }
        res.json(results[0]);
    });
});

// Crear una nueva serie
app.post('/api/series', (req, res) => {
    const { imagen, nombre, tipo, subido_hace, capitulo } = req.body;
    const query = 'INSERT INTO series (imagen, nombre, tipo, subido_hace, capitulo) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [imagen, nombre, tipo, subido_hace, capitulo], (err, results) => {
        if (err) {
            console.error('Error creating series:', err);
            res.status(500).json({ error: 'Error creating series' });
            return;
        }
        res.status(201).json({ id: results.insertId, ...req.body });
    });
});

// Actualizar una serie
app.put('/api/series/:id', (req, res) => {
    const { id } = req.params;
    const { imagen, nombre, tipo, subido_hace, capitulo } = req.body;
    const query = 'UPDATE series SET imagen = ?, nombre = ?, tipo = ?, subido_hace = ?, capitulo = ? WHERE id = ?';
    db.query(query, [imagen, nombre, tipo, subido_hace, capitulo, id], (err, results) => {
        if (err) {
            console.error('Error updating series:', err);
            res.status(500).json({ error: 'Error updating series' });
            return;
        }
        res.json({ message: 'Series updated successfully' });
    });
});

// Eliminar una serie
app.delete('/api/series/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM series WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting series:', err);
            res.status(500).json({ error: 'Error deleting series' });
            return;
        }
        res.json({ message: 'Series deleted successfully' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
