import {
    VeryRequest,
    VeryResponse,
    VeryNextFunction,
    UpdateOneSuccessResponse,
    UpdateOneOptions,
    Db,
    UpdateObject,
} from '../../types';
import { catchErrors, id } from '../../utils';
import { Document, FindOneAndUpdateOptions } from 'mongodb';
import { DocumentNotExistError } from '../../errors';

/**
 * Type guard function to check if a given `options` parameter is of type `UpdateOneOptions<T>`.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 * @param {any} options - The options to validate as `UpdateOneOptions`.
 * @returns {boolean} - Returns `true` if the parameter is `UpdateOneOptions<T>`, otherwise `false`.
 */
function isUpdateOneOptions<T>(options: any): options is UpdateOneOptions<T> {
    return true;
}

/**
 * Updates a single document in a specified MongoDB collection based on filter criteria
 * and returns a structured success response, optionally returning the updated document.
 *
 * This function performs a `findOneAndUpdate` operation on the specified collection
 * with the provided `updateObject` and `options`. If `_id` is included in the filter,
 * it attempts to convert `_id` to a valid `ObjectId`. The function constructs a structured
 * success response, which includes the updated or original document based on the `returnNew`
 * option.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 *
 * @param {string} table - The name of the MongoDB collection where the document will be updated.
 * @param {Db} db - The MongoDB database instance to interact with the specified collection.
 * @param {UpdateObject<T>} updateObject - The update operations to apply to the document, such as `$set`, `$inc`.
 * @param {UpdateOneOptions<T>} options - Configuration for the update operation, including:
 *    - `filter`: Criteria to filter the document to be updated.
 *    - `returnNew`: Boolean indicating whether to return the updated document (`true`) or the original (`false`).
 *    - `returnedMessage`: A custom message to include in the response.
 *
 * @returns {Promise<UpdateOneSuccessResponse>} - A promise resolving to an object containing:
 *    - `status`: Status of the operation (success).
 *    - `data`: The updated or original document, depending on `returnNew`.
 *    - `table`: The collection name where the update occurred.
 *    - `returnedNew`: Boolean indicating if the updated document was returned.
 *    - `message`: Custom message from `options`.
 *    - `response_created_at`: Timestamp of when the response was generated.
 *
 * @throws {Error} - If `_id` conversion in the filter fails.
 *
 * @example
 * const options: UpdateOneOptions<User> = {
 *     filter: { _id: "60d0fe4f5311236168a109ca" },
 *     returnNew: true,
 *     returnedMessage: "User updated successfully"
 * };
 * const updateObject: UpdateFilter<User> = { $set: { name: "Updated Name" } };
 *
 * const response = await _updateOne<User>("users", db, updateObject, options);
 *
 * // Example Response:
 * // {
 * //   status: "success",
 * //   data: { ... }, // The updated user document
 * //   table: "users",
 * //   returnedNew: true,
 * //   message: "User updated successfully",
 * //   response_created_at: 1698531200000
 * // }
 */
async function _updateOne<T extends Document>(
    table: string,
    db: Db,
    updateObject: UpdateObject<T>,
    options: UpdateOneOptions<T>,
): Promise<UpdateOneSuccessResponse> {
    // 1. Convert `_id` if it's in the filter
    if (options?.filter && options.filter && options.filter?._id) {
        try {
            options.filter._id = id(options.filter._id);
        } catch (err) {
            throw err; // Return early if there's an error with _id
        }
    }

    const updateOptions: FindOneAndUpdateOptions = {
        returnDocument: options?.returnNew === true ? 'after' : 'before',
    };

    // 2. Execute the `findOneAndUpdate` operation with the given filter and update object
    let result = await db.collection<T>(table).findOneAndUpdate(options?.filter || {}, updateObject, updateOptions); // defaults to an empty filter if undefined

    // 3. Await asynchronous operation
    if (!result) {
        throw new DocumentNotExistError(options?.filter);
    }

    // 4. Construct response
    const response: UpdateOneSuccessResponse = {
        status: 'success',
        data: result,
        table,
        returnedNew: options?.returnNew === true,
        message: options?.returnedMessage,
        response_created_at: Date.now(),
    };

    return response;
}

/**
 * Returns an Express route handler to update a single document of type `T` in a specified MongoDB collection.
 *
 * This function creates a route handler that, when called, updates a single document in a MongoDB
 * collection using data provided in the `req.update_object` and `req.db_options` objects. It uses
 * `catchErrors` to handle asynchronous errors in Express. The handler verifies that both
 * `req.db_options` (of type `UpdateOneOptions<T>`) and `req.update_object` are available and valid
 * before calling `_updateOne` to perform the update. The response includes the updated document data,
 * additional metadata, and is returned with a `200 OK` status code.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 *
 * @param {string} table - The name of the MongoDB collection where the document will be updated.
 * @returns {Function} - An Express route handler function that updates a document in the specified
 *    collection based on options in the request and returns a structured success response.
 *
 * @example
 * // Middleware to set `db_options` and `update_object` for the update operation
 * function setUpdateOptions(req: VeryRequest<User>, res: Response, next: NextFunction) {
 *     req.db_options = {
 *         filter: { _id: "60d0fe4f5311236168a109ca" },
 *         returnNew: true,
 *         returnedMessage: "User updated successfully"
 *     };
 *     req.update_object = { $set: { name: "Updated Name" } }; // Update operation
 *     next();
 * }
 *
 * const userController = updateOne<User>("users"); // Create handler for "users" collection
 *
 * // Use in an Express route
 * app.patch('/users/:id', setUpdateOptions, userController);
 *
 * // Example Response:
 * // {
 * //   status: "success",
 * //   data: { ... }, // The updated user document
 * //   table: "users",
 * //   returnedNew: true,
 * //   message: "User updated successfully",
 * //   response_created_at: 1698531200000
 * // }
 */
function updateOne<T extends Document>(table: string) {
    return catchErrors(async function (req: VeryRequest, res: VeryResponse, next: VeryNextFunction) {
        // Check if `db_options` and `update_object` are valid
        if (!isUpdateOneOptions(req.db_options) || !req.update_object || !req.db_options.filter || !req.db) {
            throw new Error('Update parameters are not available or are invalid');
        }
        const updateObject = req.update_object as UpdateObject<T>;
        // Perform the update operation
        const response: UpdateOneSuccessResponse = await _updateOne<T>(table, req.db, updateObject, req.db_options);

        // Send response
        res.status(200).json(response);
    });
}

export { updateOne, _updateOne };
