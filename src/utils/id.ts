import { ObjectId } from 'mongodb';
import { InvalidIdError } from '../errors';

/**
 * Converts a given `id` to a MongoDB `ObjectId` if valid.
 *
 * This function checks if the provided `id` is a valid MongoDB ObjectId.
 * If valid, it returns a new `ObjectId` instance; otherwise, it throws an `InvalidIdError`.
 * This is useful for ensuring that input data intended to be MongoDB IDs are properly validated
 * before database operations.
 *
 * @param {any} id - The value to convert to `ObjectId`.
 * @returns {ObjectId} - A new `ObjectId` instance if `id` is valid.
 * @throws {InvalidIdError} - If `id` is not a valid ObjectId format.
 */
function id(id: any): ObjectId {
    if (ObjectId.isValid(id)) return new ObjectId(id);
    throw new InvalidIdError(id);
}

export { id };
