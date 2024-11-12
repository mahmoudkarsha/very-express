import { addMethod, string, array, number, object, mixed, boolean, date, InferType, ValidationError } from 'yup';
import * as yup from 'yup';
declare module 'yup' {
    interface StringSchema {
        empty(message?: string): StringSchema;
        password(): StringSchema;
        germanNumber(message?: string): StringSchema;
        year(message?: string): StringSchema;
        number(message?: string): StringSchema;
        yesOrNo(message?: string): StringSchema;
    }
    interface ArraySchema<TIn extends any[] | null | undefined, TContext = any, TDefault = undefined, TFlags extends yup.Flags = '', T extends unknown = any> {
        empty(message?: string): ArraySchema<TIn, TContext, TDefault, TFlags, T>;
    }
}

// string methods
addMethod<any>(string, 'empty', (message?: string) => {
    return string().is([''], message);
});

addMethod<any>(string, 'yesOrNo', (message?: string) => {
    return string().is(['yes', 'no'], message).required();
});

addMethod<any>(string, 'germanNumber', (message?: string) => {
    return string().matches(/^(?:\+49|0)[1-9][0-9]{9,14}$/, message);
});

addMethod<any>(string, 'year', (message?: string) => {
    return string().matches(/^(?:19[5-9]\d|20\d{2}|2100)$/, message);
});

addMethod<any>(string, 'number', (message?: string) => {
    return string().matches(/^-?\d+$/, message);
});

addMethod<any>(string, 'password', () => {
    return string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character');
});

// array methods
addMethod<any>(array, 'empty', (message?: string) => {
    return array().max(0, message);
});

export { string, boolean, number, array, object, mixed, date, InferType, ValidationError };
