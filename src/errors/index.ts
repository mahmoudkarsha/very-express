import { InvalidIdError, DocumentAlreadyExistError, DocumentNotExistError } from './classes/DatabaseErrors';
import { UrlNotExistError } from './classes/NotFoundError';
import { DevelopmentError } from './classes/DevelopmentError';
import {
    NotLoggedInError,
    UserNoLongerExistsError,
    PermissionDeniedError,
    TokenExpiredError,
    InvalidTokenError,
    InvalidCredentialsError,
} from './classes/AuthErrors';
export {
    InvalidIdError,
    DocumentAlreadyExistError,
    DocumentNotExistError,
    DevelopmentError,
    UrlNotExistError,
    NotLoggedInError,
    UserNoLongerExistsError,
    PermissionDeniedError,
    TokenExpiredError,
    InvalidTokenError,
    InvalidCredentialsError,
};
