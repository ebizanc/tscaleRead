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

app.get('/wgymd', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const { ymd } = req.query;
    if (ymd) {
      // ymd는 'YYYYMMDD' 또는 'YYYY-MM-DD' 모두 허용 → 숫자만 비교
      const raw = String(ymd);
      const digits = raw.replace(/[^0-9]/g, '').slice(0, 8);
      request.input('ymdDigits', sql.VarChar(8), digits);
      const result = await request.query(`
        SELECT TOP (500) *
        FROM WGYMD
        WHERE REPLACE(YMD, '-', '') = @ymdDigits
        ORDER BY YMD DESC, TIME1 DESC
      `);
      return res.json(result.recordset);
    }
    const result = await request.query(`
      SELECT TOP (50) *
      FROM WGYMD
      ORDER BY YMD DESC, TIME1 DESC
    `);
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


