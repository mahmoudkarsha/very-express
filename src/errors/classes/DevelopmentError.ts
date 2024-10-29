/**
 * Custom error class for development-related errors, extending the base Error class.
 *
 * The `DevelopmentError` class includes an HTTP status code of 500, representing an
 * internal server error, and captures the stack trace for debugging. This class is
 * useful for categorizing errors that occur specifically during development.
 *
 * @extends {Error}
 *
 * @property {number} statusCode - The HTTP status code associated with the error, set to 500 by default.
 *
 * @constructor
 * @param {string} message - A descriptive error message that provides details about the error.
 *
 * @example
 * // Throwing a new DevelopmentError
 * throw new DevelopmentError("An unexpected development error occurred.");
 *
 * @example
 * // Catching and logging a DevelopmentError
 * try {
 *     throw new DevelopmentError("An error occurred in development");
 * } catch (error) {
 *     console.error(error.name);         // "Development Error"
 *     console.error(error.statusCode);   // 500
 *     console.error(error.message);      // "An error occurred in development"
 *     console.error(error.stack);        // Stack trace
 * }
 */

export class DevelopmentError extends Error {
    statusCode: number;
    constructor(message: string) {
        super(message);
        this.name = 'DevelopmentError';
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}
