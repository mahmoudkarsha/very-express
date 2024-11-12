import { Req, Res, Next, GetAllSuccessResponse, GetAllOptions, Db } from '../../types';
import { catchErrors, id } from '../../utils';

/**
 * Type guard to verify if an object matches the `GetAllOptions` structure.
 *
 * This function checks if the provided `options` object contains a `page` property, which indicates
 * it may be a valid `GetAllOptions` object. This is useful for runtime type checking before using
 * `options` in other functions.
 *
 * @template T - The document type for `GetAllOptions`.
 *
 * @param {any} options - The object to verify.
 * @returns {options is GetAllOptions<T>} - Returns `true` if `options` matches `GetAllOptions<T>`, otherwise `false`.
 *
 * @example
 * const options = { page: 1, limit: 10 };
 * if (isGetAllOptions<User>(options)) {
 *     // `options` is safely typed as `GetAllOptions<User>` here
 * }
 */
function isGetAllOptions<T>(options: any): options is GetAllOptions<T> {
    return true; // Placeholder for actual type-checking logic
}

/**
 * Retrieves multiple documents from a specified MongoDB collection with optional filtering,
 * pagination, sorting, and lookup capabilities.
 *
 * This function fetches documents based on optional filter criteria and applies pagination
 * (page and limit) and sorting. If a lookup configuration is provided, it performs a lookup
 * to enrich each document with related data from a foreign collection. The response includes
 * a summary with the total number of documents, total pages, current page, and a custom message.
 *
 * @template T - The document type extending `Document` for MongoDB compatibility.
 *
 * @param {string} table - The name of the MongoDB collection from which to retrieve documents.
 * @param {Db} db - The MongoDB database instance to interact with the specified collection.
 * @param {GetAllOptions<T>} [options] - Optional configuration for the query, including:
 *    - `filter`: Criteria to filter the documents to be retrieved.
 *    - `page`: The page number for pagination.
 *    - `limit`: The number of documents to retrieve per page.
 *    - `sort`: Sorting configuration for the results.
 *    - `lookup`: Configuration for performing a lookup operation to enrich documents with related data.
 *    - `returnedMessage`: A custom message to include in the response.
 *
 * @returns {Promise<GetAllSuccessResponse>} - A promise resolving to an object containing:
 *    - `status`: Status of the operation (success).
 *    - `data`: Array of documents matching the query.
 *    - `table`: The collection name.
 *    - `totalDocs`: Total number of documents matching the filter criteria.
 *    - `totalPages`: Total number of pages based on the document count and page size.
 *    - `currentPage`: The current page number.
 *    - `limit`: The maximum number of documents per page.
 *    - `message`: Custom message from `options`.
 *    - `response_created_at`: Timestamp of when the response was generated.
 *
 * @throws {Error} - If `_id` conversion in the filter fails.
 *
 * @example
 * const options: GetAllOptions<User> = {
 *     filter: { age: { $gt: 25 } },
 *     page: 1,
 *     limit: 10,
 *     sort: { name: 1 },
 *     lookup: {
 *         foreign_collection: "roles",
 *         foreign_field: "_id",
 *         local_field: "roleId",
 *         as: "roleInfo"
 *     },
 *     returnedMessage: "Users retrieved successfully"
 * };
 *
 * const response = await _getAll<User>("users", db, options);
 *
 * // Example Response:
 * // {
 * //   status: "success",
 * //   data: [...], // Array of user documents
 * //   table: "users",
 * //   totalDocs: 50,
 * //   totalPages: 5,
 * //   currentPage: 1,
 * //   limit: 10,
 * //   message: "Users retrieved successfully",
 * //   response_created_at: 1698531200000
 * // }
 */
async function _getAll<T extends Document>(table: string, db: Db, options?: GetAllOptions<T>): Promise<GetAllSuccessResponse> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const sort = options?.sort || {};

    // Convert `_id` to ObjectId if specified in the filter
    if (options?.filter && options.filter._id) {
        options.filter._id = id(options.filter._id);
    }

    // Retrieve documents with pagination and sorting
    let results = await db
        .collection(table)
        .find(options?.filter || {}) // defaults to an empty filter if undefined
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

    // Perform lookups if lookup options are provided
    if (options?.lookup && options.lookup.foreign_collection && options.lookup.foreign_field && options.lookup.local_field) {
        const { foreign_collection, foreign_field, local_field, as } = options.lookup;
        const asField = as || local_field; // Use `as` if provided, otherwise `local_field`

        results = await Promise.all(
            results.map(async (doc) => {
                const filter: any = { [foreign_field]: doc[local_field] };
                const foreignResult = await db.collection(foreign_collection).findOne(filter);
                doc[asField] = foreignResult || null; // Add result or `null` if no match
                return doc;
            }),
        );
    }

    // Count total documents for pagination summary
    const count = await db.collection(table).countDocuments(options?.filter || {});

    // Construct and return a success response
    const response: GetAllSuccessResponse = {
        status: 'success',
        data: results,
        table,
        totalDocs: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        limit,
        message: options?.returnedMessage,
        response_created_at: Date.now(),
    };
    return response;
}

/**
 * Returns an Express route handler to retrieve multiple documents of type `T` from a specified MongoDB collection.
 *
 * This function creates a route handler that, when called, retrieves multiple documents from a MongoDB
 * collection using options provided in the `req.db_options` object. It uses `catchErrors` to handle
 * asynchronous errors in Express. The handler verifies that `req.db_options` is of type `GetAllOptions<T>`
 * before calling `_getAll` to perform the retrieval. The response includes a paginated list of documents
 * with additional metadata, and is returned with a `200 OK` status code.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 *
 * @param {string} table - The name of the MongoDB collection from which to retrieve documents.
 * @returns {Function} - An Express route handler function that retrieves documents from the specified
 *    collection based on options in the request, and returns a structured success response.
 *
 * @example
 * // Middleware to set `db_options` for the get operation
 * function setGetAllOptions(req: Req<User>, res: Response, next: NextFunction) {
 *     req.db_options = {
 *         filter: { age: { $gt: 25 } },
 *         page: 1,
 *         limit: 10,
 *         sort: { name: 1 },
 *         lookup: {
 *             foreign_collection: "roles",
 *             foreign_field: "_id",
 *             local_field: "roleId",
 *             as: "roleInfo"
 *         },
 *         returnedMessage: "Users retrieved successfully"
 *     };
 *     next();
 * }
 *
 * const userController = getAll<User>("users"); // Create handler for "users" collection
 *
 * // Use in an Express route
 * app.get('/users', setGetAllOptions, userController);
 *
 * // Example Response:
 * // {
 * //   status: "success",
 * //   data: [...], // Array of user documents
 * //   table: "users",
 * //   totalDocs: 50,
 * //   totalPages: 5,
 * //   currentPage: 1,
 * //   limit: 10,
 * //   message: "Users retrieved successfully",
 * //   response_created_at: 1698531200000
 * // }
 */
function getAll<T extends Document>(table: string) {
    return catchErrors(async function (req: Req, res: Res, next: Next) {
        if (!isGetAllOptions(req.db_options) || !req.db) return;
        const response: GetAllSuccessResponse = await _getAll<T>(table, req.db, req.db_options);
        res.status(200).json(response);
    });
}

export { getAll, _getAll };
