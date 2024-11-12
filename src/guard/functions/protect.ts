import { _getOne } from '../../database';
import { JwtService, JwtTokenExpiredError, JsonWebTokenError, NotBeforeError } from '../../jwt';
import { Db, Next, Req, Res } from '../../types';
import { catchErrors, id } from '../../utils';
import { toInt, toStr } from '../../parsers';
import { DevelopmentError, InvalidTokenError, NotLoggedInError, PermissionDeniedError, TokenExpiredError, UserNoLongerExistsError } from '../../errors';
import { Socket, ExtendedError } from 'socket.io';
import { configDotenv } from 'dotenv';
import { Langs } from '../../../src/config';
configDotenv();
const secret = toStr(process.env?.JWT_SECRET, 'change this secret');
const tokenExpirationInSeconds = toInt(process.env?.JWT_EXPIRATION_IN_SECONDS, 60 * 60);

const jwtService = new JwtService(secret, tokenExpirationInSeconds);

/**
 * Middleware to protect routes by validating JWT authentication and authorizing user roles.
 *
 * This function retrieves a JWT token from the request header or cookies, verifies the token,
 * and ensures that the associated user exists and has the necessary permissions.
 * If any validation fails, it throws an appropriate error to prevent unauthorized access.
 *
 * @param {...string} roles - Allowed user roles. Pass '*' to allow access to all authenticated users,
 *                            or specify specific roles (e.g., "admin", "user") for restricted access.
 * @returns {Function} Middleware function that handles authentication and authorization.
 *
 * @throws {DevelopmentError} - If the database instance is not assigned to the request.
 * @throws {NotLoggedInError} - If the token is missing from the request.
 * @throws {TokenExpiredError} - If the token has expired or is not yet valid.
 * @throws {InvalidTokenError} - If the token is invalid or lacks a valid user ID payload.
 * @throws {UserNoLongerExistsError} - If the user associated with the token no longer exists.
 * @throws {PermissionDeniedError} - If the authenticated user's role does not match the required roles.
 */
const protect = (...roles: string[]) =>
    catchErrors(async function <T = any, L extends string = string>(req: Req<T, L>, res: Res, next: Next) {
        if (!req.db) throw new DevelopmentError('Please assign a database to the request');

        // Retrieve token from header or cookies
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        // Check if token is present
        if (!token) {
            throw new NotLoggedInError(req.language); // `req.language` now uses type `L`
        }
        // Verify token
        let decoded;
        try {
            decoded = await jwtService.verifyToken(token);
        } catch (error) {
            if (error instanceof JwtTokenExpiredError) {
                throw new TokenExpiredError(error.expiredAt.getTime(), req.language);
            } else if (error instanceof JsonWebTokenError) {
                throw new InvalidTokenError(req.language);
            } else if (error instanceof NotBeforeError) {
                throw new TokenExpiredError(error.date.getTime(), req.language);
            } else throw error;
        }

        // Check if token payload has a valid user ID
        if (!decoded || !decoded.id) {
            throw new InvalidTokenError(req.language);
        }

        // Retrieve current user from the database
        const currentUser = await _getOne('users', req.db, {
            filter: {
                _id: id(decoded.id),
            },
        });

        if (!currentUser.data) {
            throw new UserNoLongerExistsError<L>(decoded.id, req.language);
        }

        // Assign user to request object
        req.user = currentUser.data;

        // Check for role authorization
        if (!roles.includes('*') && !roles.includes(req.user.role)) {
            throw new PermissionDeniedError<L>(req.url, req.language);
        }

        next();
    });

const socketProtect = (...roles: string[]) => {
    return async (socket: Socket, db: Db, next: (error?: ExtendedError) => void) => {
        if (!db) throw new DevelopmentError('Please assign a database to the request');
        // Retrieve token from header or cookies
        let token;
        let lang = socket.handshake.query?.language as Langs;
        if (socket && socket.handshake.auth && socket.handshake.auth.token && typeof socket.handshake.auth.token === 'string' && socket.handshake.auth.token.startsWith('Bearer')) {
            token = socket.handshake.auth.token.split(' ')[1];
        } else if (socket.handshake.headers && socket.handshake.headers.authorization) {
            token = socket.handshake.headers.authorization;
        }

        // Check if token is present
        if (!token) {
            return next(new NotLoggedInError(lang)); // `req.language` now uses type `L`
        }
        // Verify token
        let decoded;
        try {
            decoded = await jwtService.verifyToken(token);
        } catch (error) {
            if (error instanceof JwtTokenExpiredError) {
                return next(new TokenExpiredError(error.expiredAt.getTime(), lang));
            } else if (error instanceof JsonWebTokenError) {
                return next(new InvalidTokenError(lang));
            } else if (error instanceof NotBeforeError) {
                return next(new TokenExpiredError(error.date.getTime(), lang));
            } else throw error;
        }

        // Check if token payload has a valid user ID
        if (!decoded || !decoded.id) {
            return next(new InvalidTokenError(lang));
        }

        // Retrieve current user from the database
        const currentUser = await _getOne('users', db, {
            filter: {
                _id: id(decoded.id),
            },
        });

        if (!currentUser.data) {
            return next(new UserNoLongerExistsError<Langs>(decoded.id, lang));
        }

        // Assign user to request object
        socket.user = currentUser.data;

        // Check for role authorization
        if (!roles.includes('*') && !roles.includes(socket.user.role)) {
            return next(new PermissionDeniedError<Langs>('socket io', lang));
        }

        return next();
    };
};

export { protect, socketProtect };
