const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orders');
const db = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', orderRoutes);

db.getConnection()
  .then(conn => {
    conn.release();
    console.log('✅ Base de datos conectada!');
  })
  .catch(err => {
    console.error('❌ Error de conexión a BD:', err.message);
    console.log('\n Ejecuta primero: npm run init\n');
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✅ Prueba con: http://localhost:${PORT}/api/orders\n`);
});