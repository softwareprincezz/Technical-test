const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function initializeDatabase() {
  let conn;
  try {
    // Verify MySQL connection
    console.log('Conectando a MySQL...');
    
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('✅ Conectado a MySQL');

    // Read and execute SQL script to create and initialize the database
    const sqlFile = path.join(__dirname, 'database.sql');
    const sqlScript = fs.readFileSync(sqlFile, 'utf8');

    console.log('Ejecutando script SQL...');

    await conn.query(sqlScript);

    console.log('✅ Base de datos inicializada exitosamente!');
    console.log(`\n✅ Ahora puedes ejecutar: npm run dev\n`);

    // Advice for next steps if something goes wrong
  } catch (error) {
    console.error('❌ Error al inicializar BD:', error.message);
    console.log('\n Asegúrate de que:');
    console.log('   1. MySQL está corriendo');
    console.log('   2. El archivo .env tiene credenciales correctas');
    console.log('   3. El usuario tiene permisos para crear bases de datos\n');
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

initializeDatabase();

