/**
 * Checks if the provided value is a function.
 *
 * This utility function determines if a given value is of type function,
 * returning `true` if so, and `false` otherwise. It can be used to verify
 * that a variable is a callable function before attempting to invoke it.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} - `true` if the value is a function; otherwise, `false`.
 *
 * @example
 * isFunction(() => {});        // returns true
 * isFunction(123);             // returns false
 * isFunction("text");          // returns false
 * isFunction(function() {});   // returns true
 */
export function isFunction(value: any): boolean {
    return typeof value === 'function';
}
