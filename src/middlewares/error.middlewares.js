export const errorHandler = (error, req, res, next) => {
    if (error.name === 'CastError') {
        return res.status(400).json({ status: 'error', message: 'El ID proporcionado no es válido' });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ status: 'error', message: error.message });
    }
    if (error.code === 11000) {
        return res.status(409).json({ status: 'error', message: 'El recurso ya existe' });
    }

    const statusCode = error.statusCode || 500;

    if (statusCode === 500) console.error(error);

    return res.status(statusCode).json({ status: 'error', message: error.message });
};
