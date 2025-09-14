const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');

// GET /api/contacts - Obtener todos los contactos (con búsqueda opcional)
router.get('/', ContactController.getAllContacts);

// GET /api/contacts/:id - Obtener contacto por ID
router.get('/:id', ContactController.getContactById);

// POST /api/contacts - Crear nuevo contacto
router.post('/', ContactController.createContact);

// PUT /api/contacts/:id - Actualizar contacto
router.put('/:id', ContactController.updateContact);

// DELETE /api/contacts/:id - Eliminar contacto
router.delete('/:id', ContactController.deleteContact);

module.exports = router;
