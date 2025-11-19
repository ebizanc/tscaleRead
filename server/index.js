const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: process.env.DB_USER || 'tscaleacc',
  password: process.env.DB_PASSWORD || 'bizanctscalepass!@#',
  server: process.env.DB_HOST || '121.179.52.91',
  port: Number(process.env.DB_PORT || 6433),
  database: process.env.DB_NAME || '자재관리_에코닉스',
  options: {
    encrypt: String(process.env.SQL_ENCRYPT || 'false') === 'true',
    trustServerCertificate: String(process.env.SQL_TRUST_CERT || 'true') === 'true',
  },
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/wgymd', async (_req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query('SELECT TOP (200) * FROM WGYMD');
    res.json(result.recordset);
  } catch (err) {
    console.error('MSSQL error:', err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MSSQL proxy API listening on http://localhost:${PORT}`);
});


