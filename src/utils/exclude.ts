import { DevelopmentError } from '../errors';

function __excludeFrom(object: any) {
    if (typeof object !== 'object' || object === null) {
        throw new DevelopmentError('Invalid input. Expected an object.');
    }
    const result = { ...object };
    return {
        keys<T>(...keys: (keyof T)[]) {
            keys.forEach((key) => delete result[key]);
            return result;
        },
    };
}

export { __excludeFrom };
