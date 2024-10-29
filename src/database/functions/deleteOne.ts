import {
    VeryRequest,
    VeryResponse,
    VeryNextFunction,
    DeleteOneSuccessResponse,
    DeleteOneOptions,
    Db,
} from '../../types';
import { id, catchErrors } from '../../utils';
import { DocumentNotExistError } from '../../errors';

/**
 * Type guard function to check if an object is of type `DeleteOneOptions`.
 *
 * @template T - Document type.
 * @param {any} options - The options object to check.
 * @returns {boolean} - Returns `true` if `options` matches the `DeleteOneOptions<T>` type.
 */
function isDeleteOneOptions<T>(options: any): options is DeleteOneOptions<T> {
    return true; // This could contain actual validation logic if necessary
}

/**
 * Deletes a single document from a specified MongoDB collection based on filter criteria
 * and returns a success response. If no document matches the filter, it throws a `DocumentNotExistError`.
 *
 * This function accepts an optional filter in `options` to locate the document to delete. If the `_id` field
 * is present in the filter, it attempts to convert `_id` to a valid ObjectId. After deletion, if no document
 * is deleted, the function throws a `DocumentNotExistError`. Otherwise, it returns a structured success response.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 *
 * @param {string} table - The name of the MongoDB collection from which to delete the document.
 * @param {Db} db - The MongoDB database instance used to perform the delete operation.
 * @param {DeleteOneOptions<T>} [options] - Optional parameters to customize the delete operation, including:
 *    - `filter`: Criteria to match the document to delete, with optional `_id`.
 *    - `returnedMessage`: Custom message for the response.
 *
 * @returns {Promise<DeleteOneSuccessResponse>} - A promise that resolves to a success response object with:
 *      - `status`: Status of the operation (success).
 *      - `table`: The collection name where the deletion occurred.
 *      - `message`: Custom message from `options`.
 *      - `response_created_at`: Timestamp of when the response was generated.
 *
 * @throws {DocumentNotExistError} - Throws an error if no document matches the provided filter criteria.
 *
 * @example
 * const options = {
 *     filter: { _id: "60d0fe4f5311236168a109ca" },
 *     returnedMessage: "Document successfully deleted"
 * };
 *
 * const response = await _deleteOne<User>("users", db, options);
 *
 * // Example output:
 * // {
 * //   status: "success",
 * //   table: "users",
 * //   message: "Document successfully deleted",
 * //   response_created_at: 1698531200000
 * // }
 */
async function _deleteOne<T extends Document>(
    table: string,
    db: Db,
    options?: DeleteOneOptions<T>,
): Promise<DeleteOneSuccessResponse> {
    // Convert `_id` to ObjectId if it's present in the filter
    if (options?.filter && options.filter._id) {
        options.filter._id = id(options.filter._id);
    }

    // Attempt to delete the document based on the provided filter criteria
    const result = await db.collection<T>(table).deleteOne(options?.filter);
    if (!result.deletedCount) {
        throw new DocumentNotExistError(options?.filter); // Error if no document was deleted
    }

    // Construct and return a success response
    const response: DeleteOneSuccessResponse = {
        status: 'success',
        table,
        message: options?.returnedMessage,
        response_created_at: Date.now(),
    };

    return response;
}

/**
 * Returns an Express route handler to delete a single document of type `T` from a specified MongoDB collection.
 *
 * This function creates a route handler that, when called, uses the `catchErrors` utility to handle
 * asynchronous errors in Express. It checks the request for necessary delete options (`db_options`) and
 * then calls `_deleteOne` to perform the deletion in the specified MongoDB collection. Upon successful deletion,
 * the handler responds with a structured success response and a `200 OK` status code.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 *
 * @param {string} table - The name of the MongoDB collection from which the document will be deleted.
 * @returns {Function} - An Express route handler function that deletes a document from the specified
 *    collection based on data in the request, and returns a structured success response.
 *
 * @example
 * // Middleware to set `db_options` for the delete operation
 * function setDeleteOptions(req: VeryRequest<User>, res: Response, next: NextFunction) {
 *     req.db_options = {
 *         filter: { _id: "60d0fe4f5311236168a109ca" },
 *         returnedMessage: "Document successfully deleted"
 *     };
 *     next();
 * }
 *
 * const userController = deleteOne<User>("users"); // Create handler for "users" collection
 *
 * // Use in an Express route
 * app.delete('/users/:id', setDeleteOptions, userController);
 *
 * // Example Response:
 * // {
 * //   status: "success",
 * //   table: "users",
 * //   message: "Document successfully deleted",
 * //   response_created_at: 1698531200000
 * // }
 */
function deleteOne<T extends Document>(table: string) {
    return catchErrors(async function (req: VeryRequest, res: VeryResponse, next: VeryNextFunction) {
        // Validate delete options and ensure database instance exists
        if (!isDeleteOneOptions(req.db_options) || !req.db) return;

        // Perform the deletion operation
        const response: DeleteOneSuccessResponse = await _deleteOne<T>(table, req.db, req.db_options);

        // Send a structured success response with a 200 status code
        res.status(200).json(response);
    });
}

export { deleteOne, _deleteOne };
