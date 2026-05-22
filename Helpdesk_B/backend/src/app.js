const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API Helpdesk ERP funcionando correctamente',
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS fecha_actual');

    res.json({
      mensaje: 'Conexión a PostgreSQL correcta',
      fecha: result.rows[0].fecha_actual,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error conectando a PostgreSQL',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});