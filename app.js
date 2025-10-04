// ✅ Cargar variables de entorno
require('dotenv').config();   // 👈 DEBE IR PRIMERO

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // carpeta views

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Rutas de la API
const unidadesRoutes = require('./routes/unidades.js');
app.use('/api/unidades', unidadesRoutes);

// ✅ Ruta raíz que muestra la vista unidades.ejs
app.get('/', (req, res) => {
  res.render('unidades', { unidades: [], mensaje: '' });
});

// ✅ Test de conexión a la BD (opcional pero recomendado)
const pool = require('./config/db');
(async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS ahora');
    console.log('✅ Conectado a Railway. Hora del servidor:', rows[0].ahora);
  } catch (err) {
    console.error('❌ Error al conectar con la BD:', err.message);
  }
})();

// ✅ Iniciar servidor
const PORT = process.env.PORT || 25253;  // Railway asigna automáticamente un puerto
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`)
);
