/**
 * Module for simplified Express server setup with optional MongoDB integration.
 *
 * This module provides a streamlined server initialization function (`VeryServer`)
 * that enhances an Express app with extended request/response types, convenient route
 * and middleware management, and error handling capabilities. It also supports
 * automatic browser opening when the command "open" is entered in the console.
 */

import express, { Router } from 'express';
import { exec } from 'child_process';
import { Next, Req, Res, ErrorHandler, Middleware, CustomErrorMessages, ServerOptions } from '../types';
import { blueBgLog } from '../logger';
import { errorMessages } from '../errors/errorMessages';
import { createServer } from 'http';
import cors from 'cors';

let customErrorMessages = { ...errorMessages };

/**
 * Initializes an Express server with specified options, including port and JSON parsing.
 * Provides methods for route management, middleware application, and custom error handling.
 * Optionally opens the server's URL in the default browser upon receiving the "open" command.
 *
 * @param {ServerOptions} options - Configuration options for server setup:
 *    - `port`: Port number for the server.
 *    - `corsOptions`: CORS settings.
 *    - `parseJson`: Flag to enable JSON body parsing.
 *    - `jsonSizeLimit`: Maximum size of JSON payloads.
 * @returns {object} - Server API with methods for managing routes, middlewares, and error handling.
 */
const veryServer = (options: ServerOptions) => {
    const { port, corsOptions, parseJson, jsonSizeLimit } = options;
    const app = express();

    if (corsOptions && corsOptions.origin) {
        app.use(cors(corsOptions));
    }
    if (parseJson) {
        app.use(express.json({ limit: jsonSizeLimit }));
    }

    // Starts the server and listens on the specified port
    const server = createServer(app);
    server.listen(port, () => {
        blueBgLog(`Server is running at http://localhost:${port}`);
    });

    // Opens a browser window to the server URL upon "open" command input
    process.stdin.on('data', (data) => {
        if (data.toString().trim() === 'open') {
            console.log('Opening browser window...');
            exec('firefox http://localhost:' + port);
        }
    });

    return {
        app,
        server,
        /**
         * Adds multiple middleware functions to the Express app.
         *
         * @param {Middleware[]} ms - Array of middleware functions to add.
         */
        middlewares(ms: Middleware[]) {
            ms.forEach((middleware) => {
                app.use(middleware);
            });
        },

        /**
         * Registers a router for handling requests at a specific base path.
         *
         * @param {string} path - Base URL path for the router.
         * @param {Router} routerInstance - An Express Router instance.
         */
        route(path: string, routerInstance: Router) {
            app.use(path, routerInstance);
        },

        // HTTP method wrappers for defining routes directly on the Express app
        get: app.get.bind(app),
        post: app.post.bind(app),
        put: app.put.bind(app),
        delete: app.delete.bind(app),
        patch: app.patch.bind(app),
        all: app.all.bind(app),

        /**
         * Updates the custom error messages used across the server.
         *
         * @param {CustomErrorMessages<L>} errorMessages - New error messages object.
         * @template L - String type for language codes.
         */
        setErrorMessages: <L extends string>(errorMessages: CustomErrorMessages<L>) => {
            customErrorMessages = { ...customErrorMessages, ...errorMessages };
        },

        /**
         * Sets a 404 handler for any unmatched routes.
         *
         * @param {any} response - JSON response sent when no routes match the request.
         */
        notFound(response: any) {
            app.use('*', function (req: Req, res: Res) {
                res.status(404).json(response);
            });
        },

        /**
         * Adds a custom error handling middleware to the Express app.
         *
         * @param {ErrorHandler} cb - Callback function for error handling.
         */
        setErrorHandler(cb: ErrorHandler) {
            app.use(cb);
        },
    };
};

// Exports for setting up an Very server, router, and associated types
export { customErrorMessages, CustomErrorMessages, veryServer, Router as VeryRouter, Req, Res, Next };
