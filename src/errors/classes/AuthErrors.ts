import { customErrorMessages as errorMessages } from '../../server';

/**
 * Error indicating that the provided token has expired.
 *
 * @template L - Type for language codes (e.g., 'en', 'fr').
 * @param {number} expiredAt - Timestamp of the token's expiration time.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code for unauthorized access (401).
 * @property {string} message - Localized error message indicating token expiration.
 * @property {number} expiredAt - Expiration timestamp of the token.
 */
export class TokenExpiredError<L> extends Error {
    statusCode: number;
    message: string;
    expiredAt: number;
    constructor(expiredAt: number, language?: L) {
        super();
        this.message =
            (language && errorMessages.tokenExpired[language]?.(expiredAt)) ||
            errorMessages.tokenExpired['en']?.(expiredAt);
        this.expiredAt = expiredAt;
        this.name = 'TokenExpired';
        this.statusCode = 401;
    }
}

/**
 * Error indicating that the user is not logged in or missing authentication credentials.
 *
 * @template L - Type for language codes.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code for unauthorized access (401).
 * @property {string} message - Localized error message for missing login.
 */
export class NotLoggedInError<L> extends Error {
    statusCode: number;
    message: string;
    constructor(language?: L) {
        super();
        this.message = (language && errorMessages.notLoggedIn[language]?.()) || errorMessages.notLoggedIn['en']?.();
        this.name = 'NotLoggedIn';
        this.statusCode = 401;
    }
}

/**
 * Error indicating invalid user credentials provided during authentication.
 *
 * @template L - Type for language codes.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code for unauthorized access (401).
 * @property {string} message - Localized error message for invalid credentials.
 */
export class InvalidCredentialsError<L> extends Error {
    statusCode: number;
    message: string;
    constructor(language?: L) {
        super();
        this.message =
            (language && errorMessages.invalidCredentials[language]?.()) || errorMessages.invalidCredentials['en']?.();
        this.name = 'InvalidCredentials';
        this.statusCode = 401;
    }
}

/**
 * Error indicating that a user associated with a given ID no longer exists.
 *
 * @template L - Type for language codes.
 * @param {string} userId - ID of the user that no longer exists.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code for not found (404).
 * @property {string} message - Localized error message for a non-existent user.
 */
export class UserNoLongerExistsError<L> extends Error {
    statusCode: number;
    message: string;
    constructor(userId: string, language?: L) {
        super();
        this.message =
            (language && errorMessages.userNoLongerExist[language]?.(userId)) ||
            errorMessages.userNoLongerExist['en']?.(userId);
        this.name = 'UserNoLongerExists';
        this.statusCode = 404;
    }
}

/**
 * Error indicating insufficient permissions for accessing a specific URL.
 *
 * @template L - Type for language codes.
 * @param {string} url - The URL the user attempted to access.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code for forbidden access (403).
 * @property {string} message - Localized error message for permission denial.
 * @property {string} url - The restricted URL.
 */
export class PermissionDeniedError<L> extends Error {
    statusCode: number;
    message: string;
    url: string;
    constructor(url: string, language?: L) {
        super();
        this.message =
            (language && errorMessages.permissionDenied[language]?.(url)) ||
            errorMessages.permissionDenied['en']?.(url);
        this.name = 'PermissionDenied';
        this.statusCode = 403;
        this.url = url;
    }
}

/**
 * Error indicating that the provided token is invalid.
 *
 * @template L - Type for language codes.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code for unauthorized access (401).
 * @property {string} message - Localized error message indicating an invalid token.
 */
export class InvalidTokenError<L> extends Error {
    statusCode: number;
    message: string;
    constructor(language?: L) {
        super();
        this.message = (language && errorMessages.invalidToken[language]?.()) || errorMessages.invalidToken['en']?.();
        this.name = 'InvalidToken';
        this.statusCode = 401;
    }
}
