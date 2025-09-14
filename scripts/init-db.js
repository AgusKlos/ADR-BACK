const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
    let connection;
    
    try {
        // Conectar sin especificar base de datos para crearla
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Conectado al servidor MySQL');

        // Crear base de datos si no existe
        const dbName = process.env.DB_NAME || 'contacts_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Base de datos '${dbName}' creada o ya existe`);

        // Usar la base de datos
        await connection.query(`USE \`${dbName}\``);

        // Crear tabla de contactos
        const createContactsTable = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL,
                apellido VARCHAR(50) NOT NULL,
                telefono VARCHAR(20) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_nombre (nombre),
                INDEX idx_apellido (apellido),
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;

        await connection.query(createContactsTable);
        console.log('Tabla contacts creada o ya existe');

        // Insertar datos de ejemplo si la tabla está vacía
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM contacts');
        
        if (rows[0].count === 0) {
            const insertSampleData = `
                INSERT INTO contacts (nombre, apellido, telefono, email) VALUES
                ('Juan', 'Pérez', '+54 11 1234-5678', 'juan.perez@email.com'),
                ('María', 'González', '+54 11 2345-6789', 'maria.gonzalez@email.com'),
                ('Carlos', 'López', '+54 11 3456-7890', 'carlos.lopez@email.com'),
                ('Ana', 'Martínez', '+54 11 4567-8901', 'ana.martinez@email.com'),
                ('Luis', 'Rodríguez', '+54 11 5678-9012', 'luis.rodriguez@email.com')
            `;
            
            await connection.query(insertSampleData);
            console.log('Datos de ejemplo insertados');
        }

        console.log('Inicialización de base de datos completada');

    } catch (error) {
        console.error('Error inicializando base de datos:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    createDatabase()
        .then(() => {
            console.log('Base de datos inicializada exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { createDatabase };
