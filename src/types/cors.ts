/**
 * Configuration options for Cross-Origin Resource Sharing (CORS).
 *
 * This interface provides customizable settings to control cross-origin access
 * for HTTP requests in an Express application. It specifies the allowed origins,
 * HTTP methods, headers, and additional options for handling CORS preflight
 * responses.
 */
export interface CorsOptions {
    /**
     * Specifies the origins that are allowed to access the resources.
     * Can be a single origin as a string, a regular expression, or an array of allowed origins.
     *
     * Example:
     * - `"https://example.com"`
     * - `/^https:\/\/subdomain\.example\.com$/`
     * - `["https://example.com", "https://another-example.com"]`
     */
    origin?: string | RegExp | string[];

    /**
     * Specifies the HTTP methods that are permitted for CORS requests.
     * Can be a single method as a string or an array of methods (e.g., `"GET"`, `"POST"`).
     *
     * Default: `"GET,HEAD,PUT,PATCH,POST,DELETE"`
     */
    methods?: string | string[];

    /**
     * Specifies the headers allowed in CORS requests.
     * Can be a single header as a string or an array of headers (e.g., `"Content-Type"`).
     *
     * Default: If not specified, all headers requested by the client are allowed.
     */
    allowedHeaders?: string | string[];

    /**
     * Determines whether cookies and other credentials are included in CORS requests.
     * If `true`, credentials such as cookies, authorization headers, or TLS client
     * certificates are included in requests to allowed origins.
     *
     * Default: `false`
     */
    credentials?: boolean;

    /**
     * Specifies the HTTP status code returned for successful OPTIONS preflight requests.
     * This can be useful for ensuring compatibility with certain clients that
     * may require a `200` response instead of the default `204`.
     *
     * Default: `204`
     */
    optionsSuccessStatus?: number;
}
