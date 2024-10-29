````markdown
# Very-Express.JS

A lightweight, configurable Express server setup with integrated MongoDB support, CORS options, and customizable JSON handling. `VeryExpress` simplifies the process of building robust API backends by providing a streamlined API for route, middleware, and error management, as well as automated logging and development conveniences.

## Features

-   **Express and MongoDB Integration**: Enhanced request and response types with MongoDB support.
-   **Customizable Middleware**: Easily add middleware and CORS configuration.
-   **Route Management**: Direct support for route setup using Express Router.
-   **Automatic JSON Parsing**: Optional JSON body parsing with configurable size limits.
-   **Browser Auto-Open**: Opens a browser window at the server URL upon receiving the `open` command.
-   **Customizable Error Messages**: Dynamic error message support across different languages.

## Installation

1. **Clone the repository** or add this file to your project.
2. **Install dependencies** (assuming `express` and other relevant modules are in `package.json`):

    ```bash
    npm install express cors
    ```

## Usage

### Basic Server Setup

Here’s how to set up a basic server using `VeryExpress`:

```javascript
import { veryExpress } from './VeryExpress';

const server = veryExpress({
    port: 3000,
    corsOptions: { origin: '*' }, // Allow all origins
    parseJson: true, // Enable JSON parsing
    jsonSizeLimit: '1mb', // Limit JSON payloads to 1mb
});
```
````

### Configuration Options

The `VeryExpress` function accepts an options object with the following properties:

-   **`port`**: The port number the server will listen on.
-   **`corsOptions`**: Configuration object for CORS settings (optional).
-   **`parseJson`**: Boolean to enable JSON body parsing (optional).
-   **`jsonSizeLimit`**: Specifies the maximum allowed JSON payload size (optional, defaults to `'100kb'`).

### Command to Auto-Open Browser

Run the application and type `open` in the terminal to automatically open the server’s URL in your default browser.

### Server API

The returned object provides methods for managing the server:

-   **`app`**: Access the underlying Express app instance.
-   **`middlewares(ms: Middleware[])`**: Add an array of middleware functions to the server.
-   **`route(path: string, routerInstance: Router)`**: Register an Express router at a specified path.
-   **HTTP Method Wrappers**:
    -   `get`, `post`, `put`, `delete`, `patch`, `all`: Directly define routes on the Express app.
-   **`setErrorMessages(errorMessages: CustomErrorMessages)`**: Override default error messages.
-   **`notFound(response: any)`**: Set a custom 404 response for unmatched routes.
-   **`errorHandler(cb: ErrorHandler)`**: Add a global error handler to the server.

### Example: Adding Routes and Middleware

```javascript
import { Router } from 'express';

const server = VeryExpress({ port: 3000, parseJson: true });

// Define a sample route
const router = Router();
router.get('/hello', (req, res) => res.send('Hello, World!'));

// Register the route with the server
server.route('/api', router);

// Add custom middleware
server.middlewares([
    (req, res, next) => {
        console.log('Request received:', req.method, req.url);
        next();
    },
]);
```

### Error Handling

Use `setErrorMessages` to customize error messages, and `errorHandler` to set up a global error handler:

```javascript
server.setErrorMessages({
    invalidObjectId: { en: (id) => `Invalid Object ID: ${id}` },
    notLoggedIn: { en: () => `Please log in first` },
});

server.errorHandler((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
```

## Additional Notes

-   **Browser Open**: The `open` command triggers `firefox` to open the server URL. Modify this command in `VeryExpress` if you use a different browser.
-   **Extending Error Messages**: Error messages are language-customizable using the `CustomErrorMessages` interface.

## License

This project is licensed under the MIT License.

---

This README provides all necessary information for setting up and using `VeryExpress`, along with practical examples and configuration options. Adjust the License section as needed if a different license applies.

```

```
