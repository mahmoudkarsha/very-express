import jwt, { Secret, TokenExpiredError, JsonWebTokenError, NotBeforeError } from 'jsonwebtoken';
import { promisify } from 'util';
import { toInt, toStr } from '../parsers';

/**
 * A service for creating and verifying JSON Web Tokens (JWT) with a specified secret and expiration.
 *
 * The `JwtService` class provides methods for signing a token with a user identifier (`id`) and
 * verifying a given token. It requires a secret and an expiration time for token validity.
 *
 * @class JwtService
 */
class JwtService {
    private secret?: Secret;
    private tokenExpirationInSeconds?: number;

    /**
     * Creates an instance of JwtService.
     *
     * @param {Secret} secret - The secret key used for signing and verifying tokens.
     * @param {number} tokenExpirationInSeconds - The expiration time for the token in seconds.
     * @throws {Error} - Throws an error if the `secret` is not provided.
     *
     * @example
     * const jwtService = new JwtService(process.env.JWT_SECRET, 3600); // Token expires in 1 hour
     */
    constructor(secret?: Secret, tokenExpirationInSeconds?: number) {
        this.secret = toStr(secret, 'secret') as Secret;
        this.tokenExpirationInSeconds = toInt(tokenExpirationInSeconds, 3600);
    }

    /**
     * Signs a JWT token with a user identifier.
     *
     * @param {any} id - The identifier (typically user ID) to include in the token payload.
     * @returns {string} - The signed JWT token.
     *
     * @example
     * const token = jwtService.signToken(userId);
     * console.log(token); // JWT token as a string
     */
    signToken(id: any): string {
        return jwt.sign({ id }, this.secret || 'secret', {
            expiresIn: this.tokenExpirationInSeconds,
        });
    }

    /**
     * Verifies a JWT token and returns the decoded payload if the token is valid.
     *
     * @param {string} token - The JWT token to verify.
     * @returns {Promise<any>} - A promise that resolves to the decoded token payload.
     * @throws {Error} - Throws an error if the token is invalid or expired.
     *
     * @example
     * const decoded = await jwtService.verifyToken(token);
     * console.log(decoded); // Decoded payload if the token is valid
     */
    async verifyToken(token: string): Promise<any> {
        const secret = this.secret;
        const verifyAsync: Function = promisify(jwt.verify);
        return await verifyAsync(token, secret);
    }
}

export { JwtService, TokenExpiredError as JwtTokenExpiredError, JsonWebTokenError, NotBeforeError };
