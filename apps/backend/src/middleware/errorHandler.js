export const errorHandler = (err, req, res, _next) => {
    console.error('=== ERROR HANDLER ===');
    console.error('Request:', req.method, req.path);
    console.error('Error Type:', err.constructor.name);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    console.error('Error Code:', err.code);
    console.error(
        'Error Full:',
        JSON.stringify(err, Object.getOwnPropertyNames(err)),
    );

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
