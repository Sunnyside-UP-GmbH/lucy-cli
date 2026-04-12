export declare function parse_error(error: unknown): Error;
/**
 * Kill all processes matching a specific substring in their command, with a fallback for Windows.
 * @param {string} processPattern - The substring to match (e.g., "wix:dev" or "@wix/cli/bin/wix.cjs").
 */
export declare function killAllProcesses(processPattern: string): void;
/**
 * Clean up and run a command before exiting the process.
 */
export declare function cleanupWatchers(): any;
