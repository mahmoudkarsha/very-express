import { VeryRequest, VeryResponse, VeryNextFunction, GetOneSuccessResponse, GetOneOptions, Db } from '../../types';
import { catchErrors, id } from '../../utils';

/**
 * Type guard to check if an object is of type `GetOneOptions`.
 *
 * This function checks if the provided `options` object matches the expected `GetOneOptions` structure.
 * It is useful for validating `options` at runtime to prevent unexpected errors during document retrieval.
 *
 * @template T - Document type for MongoDB.
 *
 * @param {any} options - The options object to check.
 * @returns {boolean} - Returns `true` if `options` matches `GetOneOptions<T>`.
 */
function isGetOneOptions<T>(options: any): options is GetOneOptions<T> {
    return true; // Placeholder for type-checking logic if needed
}

/**
 * Retrieves a single document from a specified MongoDB collection based on filter criteria,
 * with optional lookup to enrich the document with related data from a foreign collection.
 *
 * This function fetches a single document based on the provided filter criteria in `options`.
 * If the filter includes an `_id` field, it attempts to convert `_id` to a valid `ObjectId`.
 * If a lookup configuration is provided, it performs a lookup to add related data from a foreign
 * collection. The function returns a structured success response with the document data, metadata,
 * and an optional message.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 *
 * @param {string} table - The name of the MongoDB collection from which to retrieve the document.
 * @param {Db} db - The MongoDB database instance to interact with the specified collection.
 * @param {GetOneOptions<T>} [options] - Optional configuration for the query, including:
 *    - `filter`: Criteria to filter the document to be retrieved.
 *    - `lookup`: Configuration for performing a lookup operation to enrich the document with related data.
 *    - `returnedMessage`: A custom message to include in the response.
 *
 * @returns {Promise<GetOneSuccessResponse>} - A promise resolving to an object containing:
 *    - `status`: Status of the operation (success).
 *    - `data`: The retrieved document, or `null` if no match was found.
 *    - `table`: The collection name.
 *    - `message`: Custom message from `options`.
 *    - `response_created_at`: Timestamp of when the response was generated.
 *
 * @throws {Error} - If `_id` conversion in the filter fails.
 *
 * @example
 * const options: GetOneOptions<User> = {
 *     filter: { _id: "60d0fe4f5311236168a109ca" },
 *     lookup: {
 *         foreign_collection: "roles",
 *         foreign_field: "_id",
 *         local_field: "roleId",
 *         as: "roleInfo"
 *     },
 *     returnedMessage: "User retrieved successfully"
 * };
 *
 * const response = await _getOne<User>("users", db, options);
 *
 * // Example Response:
 * // {
 * //   status: "success",
 * //   data: { ... }, // The retrieved user document, with roleInfo if lookup is successful
 * //   table: "users",
 * //   message: "User retrieved successfully",
 * //   response_created_at: 1698531200000
 * // }
 */
async function _getOne<T extends Document>(
    table: string,
    db: Db,
    options?: GetOneOptions<T>,
): Promise<GetOneSuccessResponse> {
    // Convert `_id` in the filter to ObjectId if necessary
    if (options?.filter && options.filter._id) {
        options.filter._id = id(options.filter._id);
    }

    // Retrieve a single document based on filter criteria
    let result = await db.collection(table).findOne(options?.filter || {}); // Defaults to an empty filter if undefined

    // Perform lookup if specified in options and if a document is found
    if (
        result &&
        options?.lookup &&
        options.lookup.foreign_collection &&
        options.lookup.foreign_field &&
        options.lookup.local_field
    ) {
        const { foreign_collection, foreign_field, local_field, as } = options.lookup;
        const asField = as || local_field; // Use `as` if provided, otherwise `local_field`
        const filter: any = { [foreign_field]: result[local_field] };

        // Retrieve related data from the foreign collection
        const foreignResult = await db.collection(foreign_collection).findOne(filter);
        result[asField] = foreignResult || null; // Add result or `null` if no match
    }

    // Construct a structured response with the retrieved document data
    const response: GetOneSuccessResponse = {
        status: 'success',
        data: result, // Returns null if no match
        table,
        message: options?.returnedMessage,
        response_created_at: Date.now(),
    };

    return response;
}

/**
 * Returns an Express route handler to retrieve a single document of type `T` from a specified MongoDB collection.
 *
 * This function creates a route handler that, when called, retrieves a single document from a MongoDB
 * collection using options provided in the `req.db_options` object. It uses `catchErrors` to handle
 * asynchronous errors in Express. The handler verifies that `req.db_options` is of type `GetOneOptions<T>`
 * before calling `_getOne` to perform the retrieval. The response includes the document data, additional
 * metadata, and is returned with a `200 OK` status code.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 *
 * @param {string} table - The name of the MongoDB collection from which to retrieve the document.
 * @returns {Function} - An Express route handler function that retrieves a document from the specified
 *    collection based on options in the request, and returns a structured success response.
 *
 * @example
 * // Middleware to set `db_options` for the get operation
 * function setGetOneOptions(req: VeryRequest<User>, res: Response, next: NextFunction) {
 *     req.db_options = {
 *         filter: { _id: "60d0fe4f5311236168a109ca" },
 *         lookup: {
 *             foreign_collection: "roles",
 *             foreign_field: "_id",
 *             local_field: "roleId",
 *             as: "roleInfo"
 *         },
 *         returnedMessage: "User retrieved successfully"
 *     };
 *     next();
 * }
 *
 * const userController = getOne<User>("users"); // Create handler for "users" collection
 *
 * // Use in an Express route
 * app.get('/users/:id', setGetOneOptions, userController);
 *
 * // Example Response:
 * // {
 * //   status: "success",
 * //   data: { ... }, // The retrieved user document, with roleInfo if lookup is successful
 * //   table: "users",
 * //   message: "User retrieved successfully",
 * //   response_created_at: 1698531200000
 * // }
 */
function getOne<T extends Document>(table: string) {
    return catchErrors(async function (req: VeryRequest, res: VeryResponse, next: VeryNextFunction) {
        // Check if request options and database instance are set
        if (!isGetOneOptions(req.db_options) || !req.db) return;

        // Retrieve the document and construct a success response
        const response: GetOneSuccessResponse = await _getOne<T>(table, req.db, req.db_options);

        // Send the response with a 200 OK status code
        res.status(200).json(response);
    });
}

export { getOne, _getOne };
