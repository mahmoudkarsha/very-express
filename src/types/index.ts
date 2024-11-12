/**
 * Interfaces, types, and utility exports for defining API options, responses, and configurations.
 *
 * This module provides various types and interfaces to streamline MongoDB operations, Express middleware,
 * and server configurations, including options for CRUD operations, success response formats, and custom
 * request/response types in Express.
 */

import { SortDirection, Db, UpdateFilter, Document, OptionalUnlessRequiredId, WithId } from 'mongodb';
import { Errback, Request, Response, NextFunction } from 'express';
import { CorsOptions } from './cors';

// Lookup interface defines parameters for MongoDB lookup operations (similar to SQL joins).
interface Lookup {
    local_field: string; // Field in the current collection used to join.
    foreign_collection: string; // Collection to join with.
    foreign_field: string; // Field in the foreign collection to match.
    as?: string; // Optional alias for the joined data.
}

// FilterObject defines a flexible filter object with an optional `_id` and any other fields from T.
export type FilterObject<T> = { _id?: any } & Partial<T>;

// Sort interface defines sorting for queries, where keys are field names and values are sort directions.
interface Sort {
    [key: string]: SortDirection; // Key: Field name, Value: Sort direction (1 for ascending, -1 for descending).
}

// Pagination types for limiting the number of documents and specifying page numbers.
type Limit = number; // Maximum number of documents to retrieve.
type Page = number; // Specifies the page number in pagination.

/**
 * Options for retrieving multiple documents with optional filter, pagination, sorting, and lookup.
 */
export interface GetAllOptions<T> {
    returnedMessage?: string; // Optional message for the response.
    filter?: FilterObject<T>; // Filter criteria for documents, based on T's fields.
    page?: Page; // Page number for pagination.
    limit?: Limit; // Limit on number of documents per page.
    sort?: Sort; // Sort order for the documents.
    lookup?: Lookup; // Defines a lookup for joining related data.
}

/**
 * Options for retrieving a single document with optional filter and lookup settings.
 */
export interface GetOneOptions<T> {
    returnedMessage?: string; // Optional message for the response.
    lookup?: Lookup; // Lookup for related data.
    filter?: FilterObject<T>; // Filter criteria for finding a specific document.
}

/**
 * Options for deleting a single document, including a required filter.
 */
export interface DeleteOneOptions<T> {
    returnedMessage?: string; // Optional message for the response.
    filter: FilterObject<T>; // Filter criteria for identifying the document to delete.
}

/**
 * Options for creating a single document, with an optional response message.
 */
export interface CreateOneOptions<T> {
    returnedMessage?: string; // Optional message for the response.
}

/**
 * Options for updating a single document, including filter criteria and return options.
 */
export interface UpdateOneOptions<T> {
    returnedMessage?: string; // Optional message for the response.
    returnNew?: boolean; // If true, returns the updated document; otherwise, returns the original.
    filter: FilterObject<T>; // Filter criteria for identifying the document to update.
}

/**
 * Success response format for fetching multiple documents, including pagination details.
 */
export interface GetAllSuccessResponse {
    status: 'success'; // Indicates a successful operation.
    data: any[]; // Array of documents retrieved.
    message?: string; // Optional custom message.
    totalDocs: number; // Total number of documents matching the query.
    totalPages: number; // Total number of available pages.
    currentPage: Page; // Current page number.
    limit: Limit; // Limit of documents per page.
    table: string; // Name of the collection.
    response_created_at: number; // Timestamp of when the response was created.
}

/**
 * Success response format for fetching a single document.
 */
export interface GetOneSuccessResponse {
    status: 'success'; // Indicates a successful operation.
    data: any; // The retrieved document.
    message?: string; // Optional custom message.
    table: string; // Name of the collection.
    response_created_at: number; // Timestamp of when the response was created.
}

/**
 * Success response format for deleting a document.
 */
export interface DeleteOneSuccessResponse {
    status: 'success'; // Indicates a successful delete operation.
    message?: string; // Optional custom message.
    table: string; // Name of the collection.
    response_created_at: number; // Timestamp of when the response was created.
}

/**
 * Success response format for updating a document.
 */
export interface UpdateOneSuccessResponse {
    status: 'success'; // Indicates a successful update.
    message?: string; // Optional custom message.
    table: string; // Name of the collection.
    data: any; // The updated or original document, depending on options.
    returnedNew: boolean; // True if the updated document was returned.
    response_created_at: number; // Timestamp of when the response was created.
}

/**
 * Success response format for creating a document.
 */
export interface CreateOneSuccessResponse {
    status: 'success'; // Indicates a successful creation.
    data: any; // The created document.
    table: string; // Name of the collection.
    message?: string; // Optional custom message.
    response_created_at: number; // Timestamp of when the response was created.
}

// Types for defining document update and creation objects.
export type UpdateObject<T = Document> = UpdateFilter<T>; // Defines fields for updating a document.
export type CreateObject<T = Document> = OptionalUnlessRequiredId<WithId<T>>;
/**
 * Extended request interface for attaching database and options to an Express request.
 */
export interface Req<T = any, L extends string = string> extends Request {
    db?: Db; // MongoDB database instance attached to the request.
    db_options?: GetOneOptions<T> | CreateOneOptions<T> | UpdateOneOptions<T> | DeleteOneOptions<T> | GetAllOptions<T>; // Optional options for various CRUD operations.
    update_object?: UpdateObject<T>; // Optional update object for an update operation.
    create_object?: CreateObject<T>; // Optional create object for a create operation.
    user?: any;
    language?: L; // Language, now typed as L
}

// Re-exporting Db for convenience.
export { Db };

/**
 * Simplified types and interfaces for managing Express middleware and responses.
 */

// Defines type aliases for simplified naming of Express Response and NextFunction
export interface Res extends Response {}
export interface Next extends NextFunction {}

// Error handler function type for custom error handling in Express
export type ErrorHandler = (err: Errback, req: Req, res: Res, next: Next) => void;

// Type alias for a middleware function that uses custom request and response types
export type Middleware = (req: Req, res: Res, next: Next) => void;

/**
 * Configuration options for initializing an Express server.
 */
export interface ServerOptions {
    port: number; // Port for the server.
    corsOptions?: CorsOptions; // Optional CORS configuration.
    parseJson?: boolean; // Enable JSON parsing middleware if true.
    jsonSizeLimit?: number; // Specifies JSON payload size limit.
}

export * from './errors';
