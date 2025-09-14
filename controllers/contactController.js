const ContactModel = require('../models/Contact');
const { validateContact } = require('../validators/contactValidator');

class ContactController {
    // GET /api/contacts - Obtener todos los contactos
    static async getAllContacts(req, res) {
        try {
            const contacts = await ContactModel.getAll();
            
            // Devolver directamente el array para compatibilidad con frontend
            res.json(contacts);
        } catch (error) {
            console.error('Error obteniendo contactos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET /api/contacts/:id - Obtener contacto por ID
    static async getContactById(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea un número
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de contacto inválido'
                });
            }

            const contact = await ContactModel.getById(parseInt(id));
            
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }

            // Devolver directamente el contacto para compatibilidad con frontend
            res.json(contact);
        } catch (error) {
            console.error('Error obteniendo contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // POST /api/contacts - Crear nuevo contacto
    static async createContact(req, res) {
        try {
            // Validar datos de entrada
            const { error, value } = validateContact(req.body);
            
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de contacto inválidos',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Verificar si ya existe un contacto con el mismo email
            const emailExists = await ContactModel.existsByEmail(value.email);
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un contacto con este email'
                });
            }

            const newContact = await ContactModel.create(value);
            
            res.status(201).json({
                success: true,
                message: 'Contacto creado exitosamente',
                data: newContact
            });
        } catch (error) {
            console.error('Error creando contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // PUT /api/contacts/:id - Actualizar contacto
    static async updateContact(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea un número
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de contacto inválido'
                });
            }

            // Validar datos de entrada para actualización
            const { error, value } = validateContact(req.body, true);
            
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de contacto inválidos',
                    errors: error.details.map(detail => detail.message)
                });
            }

            // Verificar si el contacto existe
            const existingContact = await ContactModel.getById(parseInt(id));
            if (!existingContact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }

            // Si se está actualizando el email, verificar que no exista en otro contacto
            if (value.email && value.email !== existingContact.email) {
                const emailExists = await ContactModel.existsByEmail(value.email, parseInt(id));
                if (emailExists) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe otro contacto con este email'
                    });
                }
            }

            const updatedContact = await ContactModel.update(parseInt(id), value);
            
            res.json({
                success: true,
                message: 'Contacto actualizado exitosamente',
                data: updatedContact
            });
        } catch (error) {
            console.error('Error actualizando contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // DELETE /api/contacts/:id - Eliminar contacto
    static async deleteContact(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que el ID sea un número
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de contacto inválido'
                });
            }

            // Verificar si el contacto existe antes de intentar eliminarlo
            const existingContact = await ContactModel.getById(parseInt(id));
            if (!existingContact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }

            const deleted = await ContactModel.delete(parseInt(id));
            
            if (deleted) {
                res.json({
                    success: true,
                    message: 'Contacto eliminado exitosamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error eliminando contacto'
                });
            }
        } catch (error) {
            console.error('Error eliminando contacto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = ContactController;
