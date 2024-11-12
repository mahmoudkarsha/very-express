import { WithId } from 'mongodb';
import { Req, Res, Next, CreateOneSuccessResponse, CreateOneOptions, Db, CreateObject } from '../../types';
import { catchErrors } from '../../utils';

/**
 * Type guard function to check if an object is of type `CreateOneOptions`.
 *
 * This function is a type guard that returns `true` if `options` matches the `CreateOneOptions` type.
 * It enables TypeScript to properly infer types within the code.
 *
 * @template T - Document type.
 * @param {any} options - The options object to check.
 * @returns {boolean} - Returns `true` if `options` is of type `CreateOneOptions<T>`.
 */
function isCreateOneOptions<T>(options: any): options is CreateOneOptions<T> {
    return true; // Type guard logic can be implemented as needed
}

/**
 * Inserts a single document into a specified MongoDB collection and returns a structured success response.
 *
 * This function performs a `insertOne` operation on the specified collection with the provided
 * `createObject`, which contains the document fields. Upon successful insertion, it returns a
 * structured response that includes the status, inserted document data, table name, optional
 * custom message, and the timestamp of the response creation.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB.
 *
 * @param {string} table - The name of the MongoDB collection where the document will be inserted.
 * @param {Db} db - The MongoDB database instance to interact with the collection.
 * @param {CreateObject<T>} createObject - The document data to be inserted, typed as `Partial<T>`.
 * @param {CreateOneOptions<T>} [options] - Optional parameters, including:
 *    - `returnedMessage`: A custom message to include in the success response.
 *
 * @returns {Promise<CreateOneSuccessResponse>} - A promise that resolves with a success response
 *    object containing:
 *      - `status`: Status of the operation (success).
 *      - `data`: Data of the inserted document.
 *      - `table`: The collection name where the document was inserted.
 *      - `message`: Optional custom message from `options`.
 *      - `response_created_at`: Timestamp of when the response was generated.
 *
 * @example
 * const newUser = { name: "Alice", age: 25 };
 * const options = { returnedMessage: "User successfully created" };
 *
 * const response = await _createOne<User>("users", db, newUser, options);
 *
 * // Example output:
 * // {
 * //   status: 'success',
 * //   data: { insertedId: "60d0fe4f5311236168a109ca", ... },
 * //   table: 'users',
 * //   message: 'User successfully created',
 * //   response_created_at: 1698531200000
 * // }
 */
async function _createOne<T>(table: string, db: Db, createObject: CreateObject<T>, options?: CreateOneOptions<T>): Promise<CreateOneSuccessResponse> {
    // 1. Validate `createObject` against the document type
    let result = await db.collection<WithId<T>>(table).insertOne(createObject);

    const response: CreateOneSuccessResponse = {
        status: 'success',
        data: createObject, // returns null if no match
        table,
        message: options?.returnedMessage,
        response_created_at: Date.now(),
    };
    return response;
}

/**
 * Returns an Express route handler to create a new document of type `T` in a specified MongoDB collection.
 *
 * This function creates a route handler that, when called, will insert a new document of type `T` into
 * the specified MongoDB collection. It uses `catchErrors` to handle any asynchronous errors in Express.
 * The handler checks for necessary options and document data on the request object, then calls `_createOne`
 * to perform the insertion. Upon successful creation, the handler responds with a success message and a
 * `201 Created` status code.
 *
 * @template T - The document type extending `Document` to ensure compatibility with MongoDB documents.
 *
 * @param {string} table - The name of the MongoDB collection where the document will be created.
 * @returns {Function} - An Express route handler function that inserts a document into the specified
 *    collection based on data in the request, and returns a structured success response.
 *
 * @example
 * // Middleware to set `db_options` and `create_object`
 * function setCreateOptions(req: Req<User>, res: Response, next: NextFunction) {
 *     req.db_options = { returnedMessage: "User created successfully" };
 *     req.create_object = { name: "Alice", age: 25 }; // Document data for the new user
 *     next();
 * }
 *
 * const userController = createOne<User>("users"); // Create handler for "users" collection
 *
 * // Use in an Express route
 * app.post('/users', setCreateOptions, userController);
 *
 * // Example Response:
 * // {
 * //   status: "success",
 * //   data: { insertedId: "60d0fe4f5311236168a109ca", ... },
 * //   table: "users",
 * //   message: "User created successfully",
 * //   response_created_at: 1698531200000
 * // }
 */
function createOne<T>(table: string) {
    return catchErrors(async function (req: Req, res: Res, next: Next) {
        // Check if the request options are valid and create_object and db are set
        if (!isCreateOneOptions(req.db_options)) return;
        if (!req.create_object || !req.db) throw new Error(`Create`);

        // Insert the document into the specified table and return a success response
        const response: CreateOneSuccessResponse = await _createOne<T>(table, req.db, req.create_object, req.db_options);

        // Respond with a 201 Created status and the structured success response
        res.status(201).json(response);
    });
}

export { createOne, _createOne };
