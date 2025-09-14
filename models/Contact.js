const { query } = require('../config/database');

class ContactModel {
    // Obtener todos los contactos
    static async getAll() {
        const sql = `
            SELECT id, nombre, apellido, telefono, email, 
                   created_at, updated_at 
            FROM contacts 
            ORDER BY apellido, nombre
        `;
        return await query(sql);
    }

    // Obtener contacto por ID
    static async getById(id) {
        const sql = `
            SELECT id, nombre, apellido, telefono, email, 
                   created_at, updated_at 
            FROM contacts 
            WHERE id = ?
        `;
        const results = await query(sql, [id]);
        return results[0] || null;
    }

    // Crear nuevo contacto
    static async create(contactData) {
        const { nombre, apellido, telefono, email } = contactData;
        const sql = `
            INSERT INTO contacts (nombre, apellido, telefono, email) 
            VALUES (?, ?, ?, ?)
        `;
        const result = await query(sql, [nombre, apellido, telefono, email]);
        return {
            id: result.insertId,
            nombre,
            apellido,
            telefono,
            email
        };
    }

    // Actualizar contacto
    static async update(id, contactData) {
        const fields = [];
        const values = [];

        // Construir la query dinámicamente según los campos proporcionados
        Object.entries(contactData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (fields.length === 0) {
            throw new Error('No hay campos para actualizar');
        }

        values.push(id);
        const sql = `
            UPDATE contacts 
            SET ${fields.join(', ')}, updated_at = NOW() 
            WHERE id = ?
        `;

        const result = await query(sql, values);
        if (result.affectedRows === 0) {
            return null;
        }

        return await this.getById(id);
    }

    // Eliminar contacto
    static async delete(id) {
        const sql = 'DELETE FROM contacts WHERE id = ?';
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }

    // Verificar si existe un contacto con el mismo email (para evitar duplicados)
    static async existsByEmail(email, excludeId = null) {
        let sql = 'SELECT id FROM contacts WHERE email = ?';
        const params = [email];

        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }

        const results = await query(sql, params);
        return results.length > 0;
    }

    // Buscar contactos por nombre o apellido
    static async search(searchTerm) {
        const sql = `
            SELECT id, nombre, apellido, telefono, email, 
                   created_at, updated_at 
            FROM contacts 
            WHERE nombre LIKE ? OR apellido LIKE ? OR email LIKE ?
            ORDER BY apellido, nombre
        `;
        const searchPattern = `%${searchTerm}%`;
        return await query(sql, [searchPattern, searchPattern, searchPattern]);
    }
}

module.exports = ContactModel;
