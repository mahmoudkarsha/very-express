import { Req, Res, Next } from '../types';

/**
 * Wraps an asynchronous route handler to catch errors and pass them to the next middleware.
 *
 * @param {Function} fn - An asynchronous route handler function that takes `req`, `res`, and `next` arguments and returns a Promise.
 * @returns {Function} A function that calls the provided route handler and catches any errors, passing them to the next middleware.
 *
 * @example
 * app.get('/route', catchErrors(async (req, res, next) => {
 *     // Async operations here, like database queries
 *     res.send("Success!");
 * }));
 */
export const catchErrors = (fn: (req: Req<any, any>, res: Res, next: Next) => Promise<any>) => (req: Req, res: Res, next: Next) => Promise.resolve(fn(req, res, next)).catch(next);
