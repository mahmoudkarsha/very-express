/**
 * Converts a given value to an integer, with an optional fallback if conversion fails.
 *
 * This function attempts to parse the provided value as an integer. If the
 * conversion is unsuccessful (resulting in NaN), it returns the specified
 * fallback value or defaults to 0.
 *
 * @param {any} value - The value to be converted to an integer.
 * @param {number} [fallbackValue=0] - The fallback integer value to return if conversion fails.
 * @returns {number} - The parsed integer or the fallback value if parsing is unsuccessful.
 *
 * @example
 * toInt("42");          // returns 42
 * toInt("abc", 10);     // returns 10 (fallback)
 * toInt("123abc", 5);   // returns 123 (parseInt extracts leading number)
 * toInt(undefined);     // returns 0 (default fallback)
 */

function toInt(value: any, fallbackValue: number = 0): number {
    const result = parseInt(value, 10);
    return isNaN(result) ? fallbackValue : result;
}

/**
 * Converts a given value to a string, with an optional fallback if the value is null or undefined.
 *
 * If the value is not null or undefined, it attempts to convert it to a string using `String(value)`.
 * If the value is null or undefined, it returns the specified fallback string or defaults to an empty string.
 *
 * @param {any} value - The value to be converted to a string.
 * @param {string} [fallbackString=''] - The fallback string to return if value is null or undefined.
 * @returns {string} - The converted string or the fallback string.
 *
 * @example
 * toStr(42);             // returns "42"
 * toStr(null, 'default'); // returns "default" (fallback)
 * toStr(true);            // returns "true"
 * toStr(undefined);       // returns "" (default fallback)
 */
function toStr(value: any, fallbackString: string = ''): string {
    return value != null ? String(value) : fallbackString;
}

//TODO
function toBool(value: any): boolean {
    return value != null;
}
export { toInt, toStr };
