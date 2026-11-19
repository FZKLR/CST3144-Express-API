class AppError extends Error {
    /**
     * Constructor for standard app errors.
     * @param {string} message - The error message.
     * @param {number} errorCode - The HTTP status code.
     * @param {boolean} isOperational - Whether the error is operational (expected).
     */
    constructor(message, errorCode, isOperational = true) {
        super(message);
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        this.status = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
