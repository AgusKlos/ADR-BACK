const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    // Error de validación de Joi
    if (err.isJoi) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: err.details.map(detail => detail.message)
        });
    }

    // Error de sintaxis JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'JSON inválido en el cuerpo de la solicitud'
        });
    }

    // Error de base de datos
    if (err.code) {
        switch (err.code) {
            case 'ER_DUP_ENTRY':
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un registro con estos datos'
                });
            
            case 'ER_NO_SUCH_TABLE':
                return res.status(500).json({
                    success: false,
                    message: 'Error de configuración de base de datos'
                });
            
            case 'ECONNREFUSED':
                return res.status(503).json({
                    success: false,
                    message: 'No se puede conectar a la base de datos'
                });
            
            default:
                console.error('Error de base de datos:', err.code, err.sqlMessage);
                return res.status(500).json({
                    success: false,
                    message: 'Error de base de datos'
                });
        }
    }

    // Error genérico del servidor
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
