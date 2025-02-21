const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const config = require('../../config/database');
const { authenticateToken } = require('../middleware/auth');

// Create connection pool
const pool = mysql.createPool(config[process.env.NODE_ENV || 'development']);

/**
 * @route GET /api/relatorios
 * @desc Get reports with optional filters
 * @access Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      tipo,
      funcionario,
      setor,
      periodoInicio,
      periodoFim
    } = req.query;

    let query = `
      SELECT 
        e.id,
        e.tipo,
        e.data,
        e.descricao,
        f.nome as funcionario,
        f.setor,
        bh.saldo as banco_horas,
        sr.salario_base
      FROM eventos e
      LEFT JOIN funcionarios f ON e.funcionario_id = f.id
      LEFT JOIN banco_horas bh ON f.id = bh.funcionario_id
      LEFT JOIN salary_records sr ON f.id = sr.employee_id
      WHERE 1=1
    `;

    const queryParams = [];

    if (tipo) {
      query += ' AND e.tipo = ?';
      queryParams.push(tipo);
    }

    if (funcionario) {
      query += ' AND f.nome LIKE ?';
      queryParams.push(`%${funcionario}%`);
    }

    if (setor) {
      query += ' AND f.setor = ?';
      queryParams.push(setor);
    }

    if (periodoInicio) {
      query += ' AND e.data >= ?';
      queryParams.push(periodoInicio);
    }

    if (periodoFim) {
      query += ' AND e.data <= ?';
      queryParams.push(periodoFim);
    }

    query += ' ORDER BY e.data DESC';

    const [rows] = await pool.execute(query, queryParams);

    // Process the data based on report type
    let processedData = rows;
    
    if (tipo === 'banco_horas') {
      processedData = rows.map(row => ({
        funcionario: row.funcionario,
        setor: row.setor,
        saldo: row.banco_horas,
        data: row.data
      }));
    } else if (tipo === 'eventos') {
      processedData = rows.map(row => ({
        funcionario: row.funcionario,
        setor: row.setor,
        tipo: row.tipo,
        data: row.data,
        descricao: row.descricao
      }));
    } else if (tipo === 'pontualidade') {
      // Group by employee and calculate punctuality metrics
      const employeeMap = new Map();
      rows.forEach(row => {
        if (!employeeMap.has(row.funcionario)) {
          employeeMap.set(row.funcionario, {
            funcionario: row.funcionario,
            setor: row.setor,
            totalEventos: 0,
            faltas: 0,
            atrasos: 0
          });
        }
        const employee = employeeMap.get(row.funcionario);
        employee.totalEventos++;
        if (row.tipo === 'falta') employee.faltas++;
        if (row.tipo === 'atraso') employee.atrasos++;
      });
      processedData = Array.from(employeeMap.values());
    }

    res.json(processedData);

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

/**
 * @route GET /api/relatorios/summary
 * @desc Get summary statistics for reports
 * @access Private
 */
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT e.id) as total_eventos,
        COUNT(DISTINCT e.funcionario_id) as total_funcionarios,
        COUNT(DISTINCT e.tipo) as tipos_eventos
      FROM eventos e
    `);

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching report summary:', error);
    res.status(500).json({ message: 'Error fetching report summary' });
  }
});

/**
 * @route GET /api/relatorios/chart-data
 * @desc Get data for report charts
 * @access Private
 */
router.get('/chart-data', authenticateToken, async (req, res) => {
  try {
    const { tipo, periodoInicio, periodoFim } = req.query;

    let query = '';
    if (tipo === 'eventos_por_tipo') {
      query = `
        SELECT tipo, COUNT(*) as count
        FROM eventos
        WHERE data BETWEEN ? AND ?
        GROUP BY tipo
      `;
    } else if (tipo === 'eventos_por_setor') {
      query = `
        SELECT f.setor, COUNT(*) as count
        FROM eventos e
        JOIN funcionarios f ON e.funcionario_id = f.id
        WHERE e.data BETWEEN ? AND ?
        GROUP BY f.setor
      `;
    }

    const [rows] = await pool.execute(query, [periodoInicio, periodoFim]);
    res.json(rows);

  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
});

/**
 * @route POST /api/relatorios/export
 * @desc Export report data
 * @access Private
 */
router.post('/export', authenticateToken, async (req, res) => {
  try {
    const { format, reportData } = req.body;

    // Log export activity
    await pool.execute(
      'INSERT INTO report_exports (user_id, format, data) VALUES (?, ?, ?)',
      [req.user.id, format, JSON.stringify(reportData)]
    );

    res.json({ message: 'Report export logged successfully' });

  } catch (error) {
    console.error('Error logging report export:', error);
    res.status(500).json({ message: 'Error logging report export' });
  }
});

module.exports = router;