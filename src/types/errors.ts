/**
 * Interface for defining multilingual error messages with customizable language keys.
 *
 * The `ErrorMessages` interface is generic over `T`, representing a union of allowed language keys
 * (e.g., 'en', 'fr', 'de'). Each error type includes a default message in English (`en`) and optionally
 * messages in other languages, allowing applications to handle errors in multiple languages.
 *
 * @template T - A union of language keys (e.g., 'en' | 'fr' | 'de') for multilingual support.
 */
export interface ErrorMessages<T extends string> {
    /**
     * Error message indicating an invalid object ID.
     * @param {any} [id] - Optional ID of the object that is invalid.
     */
    invalidObjectId: { en: (id?: any) => string } & Partial<{
        [key in Exclude<T, 'en'>]: (id?: any) => string;
    }>;

    /**
     * Error message indicating that a document does not exist.
     * @param {any} [filter] - Optional filter criteria that resulted in a missing document.
     */
    documentNotExit: { en: (filter?: any) => string } & Partial<{
        [key in Exclude<T, 'en'>]: (filter?: any) => string;
    }>;

    /**
     * Error message indicating that a document already exists.
     * @param {any} [filter] - Optional filter criteria for the existing document.
     */
    documentAlreadyExist: { en: (filter?: any) => string } & Partial<{
        [key in Exclude<T, 'en'>]: (filter?: any) => string;
    }>;

    /**
     * Error message indicating a URL that does not exist.
     * @param {string} url - The URL that was not found.
     */
    urlNotExist: { en: (url: string) => string } & Partial<{
        [key in Exclude<T, 'en'>]: (url: string) => string;
    }>;

    /**
     * Error message for users who are not logged in.
     */
    notLoggedIn: { en: () => string } & Partial<{
        [key in Exclude<T, 'en'>]: () => string;
    }>;

    /**
     * Error message indicating that a user no longer exists.
     * @param {string} [id] - Optional user ID of the user that no longer exists.
     */
    userNoLongerExist: { en: (id?: string) => string } & Partial<{
        [key in Exclude<T, 'en'>]: (id?: string) => string;
    }>;

    /**
     * Error message for insufficient permissions.
     * @param {string} [url] - Optional URL of the resource the user is denied access to.
     */
    permissionDenied: { en: (url?: string) => string } & Partial<{
        [key in Exclude<T, 'en'>]: (url?: string) => string;
    }>;

    /**
     * Error message for an expired token.
     * @param {number} expiredAt - Expiration timestamp of the token.
     */
    tokenExpired: { en: (expiredAt: number) => string } & Partial<{
        [key in Exclude<T, 'en'>]: (expiredAt: number) => string;
    }>;

    /**
     * Error message indicating an invalid token.
     */
    invalidToken: { en: () => string } & Partial<{
        [key in Exclude<T, 'en'>]: () => string;
    }>;

    /**
     * Error message for invalid credentials.
     */
    invalidCredentials: { en: () => string } & Partial<{
        [key in Exclude<T, 'en'>]: () => string;
    }>;
}

/**
 * A partial version of `ErrorMessages`, allowing selective customization of error messages.
 *
 * This type can be used to override or add specific error messages in various languages.
 *
 * @template T - A union of language keys (e.g., 'en' | 'fr' | 'de') for multilingual support.
 */
export type CustomErrorMessages<T extends string> = Partial<ErrorMessages<T>>;
