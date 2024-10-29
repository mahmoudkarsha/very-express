import { ErrorMessages } from '../types';

const invalidObjectId = { en: (payload: string) => 'Invalid Object ID' + payload };
const documentNotExit = { en: () => 'No document found with provided filter' };
const documentAlreadyExist = { en: () => 'document already exist' };
const urlNotExist = { en: (url: string) => 'Url ' + url + ' already exist' };
const notLoggedIn = { en: () => 'Please login the website' };
const userNoLongerExist = { en: (id?: string) => 'User with id ' + id + ' no longer exist' };
const permissionDenied = { en: (url?: string) => 'Permission Denied' };
const tokenExpired = { en: (expiredAt: number) => 'Permission Denied' };
const invalidToken = { en: () => 'Invalid Token' };
const invalidCredentials = { en: () => 'Invalid username or password' };

const errorMessages: ErrorMessages<string> = {
    invalidObjectId: invalidObjectId,
    documentNotExit: documentNotExit,
    documentAlreadyExist: documentAlreadyExist,
    urlNotExist: urlNotExist,
    notLoggedIn: notLoggedIn,
    userNoLongerExist: userNoLongerExist,
    permissionDenied: permissionDenied,
    tokenExpired: tokenExpired,
    invalidToken: invalidToken,
    invalidCredentials: invalidCredentials,
};

export { errorMessages };

//////////// invalid credentials
