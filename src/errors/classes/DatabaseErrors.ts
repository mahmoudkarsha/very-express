import { customErrorMessages as errorMessages } from '../../server';

/**
 * Error indicating that a document with the same data already exists.
 *
 * @template L - Type for language codes.
 * @param {any} payload - Data related to the existing document that caused the duplication error.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code indicating a conflict (409).
 * @property {string} message - Localized error message for the duplication error.
 * @property {{ [key: string]: any }} duplicated - Object containing details of the duplicated document.
 */
export class DocumentAlreadyExistError<L> extends Error {
    statusCode: number;
    duplicated: { [key: string]: any };
    constructor(payload: any, language?: L) {
        super();
        this.message =
            (language && errorMessages.documentAlreadyExist[language]?.(payload)) ||
            errorMessages.documentAlreadyExist['en']?.(payload);
        this.name = 'DocumentAlreadyExist';
        this.statusCode = 409; // HTTP 409 Conflict for duplicate entries
        this.duplicated = payload;
    }
}

/**
 * Error indicating that a specified document does not exist in the database.
 *
 * @template L - Type for language codes.
 * @param {any} payload - Filter criteria used to locate the missing document.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code indicating not found (404).
 * @property {string} message - Localized error message for the missing document error.
 * @property {{ [key: string]: any }} filter - Object containing the filter criteria for the document.
 */
export class DocumentNotExistError<L> extends Error {
    statusCode: number;
    filter: { [key: string]: any };
    constructor(payload: any, language?: L) {
        super();
        this.message =
            (language && errorMessages.documentNotExit[language]?.(payload)) ||
            errorMessages.documentNotExit['en']?.(payload);
        this.name = 'DocumentNotExist';
        this.statusCode = 404;
        this.filter = payload;
    }
}

/**
 * Error indicating that an invalid ID was provided for a document operation.
 *
 * @template L - Type for language codes.
 * @param {any} payload - ID provided that failed validation.
 * @param {L} [language] - Language code for selecting a localized error message.
 * @property {number} statusCode - HTTP status code indicating a bad request (400).
 * @property {string} message - Localized error message for the invalid ID.
 */
export class InvalidIdError<L> extends Error {
    statusCode: number;
    message: string;
    constructor(payload: any, language?: L) {
        super();
        this.message =
            (language && errorMessages.invalidObjectId[language]?.(payload)) ||
            errorMessages.invalidObjectId['en']?.(payload);
        this.name = 'InvalidId';
        this.statusCode = 400;
    }
}
