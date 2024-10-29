/**
 * Executes a function and catches any synchronous errors, passing them to an error handler.
 *
 * @param {Function} fn - The main function to execute that may throw an error.
 * @param {Function} err - The error handler function that receives the caught error.
 *
 * @example
 * catchSyncErrors(
 *     () => { // code that may throw an error },
 *     (error) => { console.error("An error occurred:", error); }
 * );
 */
export const catchSyncErrors = function (fn: Function, err: Function) {
    try {
        fn();
    } catch (e) {
        err(e);
    }
};
