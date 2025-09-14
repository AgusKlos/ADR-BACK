const Joi = require('joi');

// Esquema de validación para crear contacto
const createContactSchema = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'El nombre es requerido',
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder 50 caracteres',
            'any.required': 'El nombre es requerido'
        }),
    
    apellido: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'El apellido es requerido',
            'string.min': 'El apellido debe tener al menos 2 caracteres',
            'string.max': 'El apellido no puede exceder 50 caracteres',
            'any.required': 'El apellido es requerido'
        }),
    
    telefono: Joi.string()
        .pattern(/^[\+]?[0-9\s\-\(\)]{7,20}$/)
        .required()
        .messages({
            'string.empty': 'El teléfono es requerido',
            'string.pattern.base': 'El teléfono debe tener un formato válido',
            'any.required': 'El teléfono es requerido'
        }),
    
    email: Joi.string()
        .email()
        .max(100)
        .required()
        .messages({
            'string.empty': 'El email es requerido',
            'string.email': 'El email debe tener un formato válido',
            'string.max': 'El email no puede exceder 100 caracteres',
            'any.required': 'El email es requerido'
        })
});

// Esquema de validación para actualizar contacto
const updateContactSchema = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(50)
        .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder 50 caracteres'
        }),
    
    apellido: Joi.string()
        .min(2)
        .max(50)
        .messages({
            'string.min': 'El apellido debe tener al menos 2 caracteres',
            'string.max': 'El apellido no puede exceder 50 caracteres'
        }),
    
    telefono: Joi.string()
        .pattern(/^[\+]?[0-9\s\-\(\)]{7,20}$/)
        .messages({
            'string.pattern.base': 'El teléfono debe tener un formato válido'
        }),
    
    email: Joi.string()
        .email()
        .max(100)
        .messages({
            'string.email': 'El email debe tener un formato válido',
            'string.max': 'El email no puede exceder 100 caracteres'
        })
}).min(1); // Al menos un campo debe ser proporcionado para la actualización

// Función de validación
const validateContact = (data, isUpdate = false) => {
    const schema = isUpdate ? updateContactSchema : createContactSchema;
    return schema.validate(data, { abortEarly: false });
};

module.exports = {
    createContactSchema,
    updateContactSchema,
    validateContact
};
