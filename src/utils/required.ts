import { DevelopmentError } from '../errors';

/**
 * Checks if a required object is provided and returns it.
 * Throws a DevelopmentError if the object is missing, specifying the missing field name if provided.
 *
 * @param requiredObject - The object that is required.
 * @param fieldName - The name of the field that is required.
 * @returns The required object if it exists.
 */
function __required(requiredObject: any, fieldName?: string) {
    if (!requiredObject) throw new DevelopmentError('Missing required field' + fieldName);
    return requiredObject;
}
export { __required };
