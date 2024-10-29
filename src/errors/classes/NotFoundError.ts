import { customErrorMessages as errorMessages } from '../../server';

export class UrlNotExistError<L> extends Error {
    statusCode: number;
    message: string;
    constructor(url: string, language?: L) {
        super();
        this.message =
            (language && errorMessages.urlNotExist[language]?.(url)) || errorMessages.urlNotExist['en']?.(url);
        this.name = 'UrlNotExist';
        this.statusCode = 404;
    }
}
