import os from 'os';
import { spawnSync } from 'child_process';
import { logger } from './utils/logger.js';
export function parse_error(error) {
    if (error instanceof Error) {
        return error;
    }
    else if (typeof error === 'string') {
        return new Error(error);
    }
    else {
        return new Error('Unknown error');
    }
}
/**
 * Kill all processes matching a specific substring in their command, with a fallback for Windows.
 * @param {string} processPattern - The substring to match (e.g., "wix:dev" or "@wix/cli/bin/wix.cjs").
 */
export function killAllProcesses(processPattern) {
    const isWindows = os.platform() === 'win32';
    const command = isWindows
        ? `tasklist /FI "IMAGENAME eq node.exe" /FO CSV | findstr "${processPattern}"`
        : `ps -eo pid,command | grep "${processPattern}" | grep -v grep`;
    logger.action(`Cleaning up processes...`);
    const result = spawnSync(command, { shell: true, encoding: 'utf-8' });
    if (result.error) {
        logger.error(`spawnSync error: ${result.error.message}`);
        return;
    }
    // if (!result.stdout.trim()) {
    //     logger.info(`No processes found matching pattern: ${processPattern}`);
    //     return;
    // }
    const lines = result.stdout.trim().split('\n');
    const pids = isWindows
        ? lines.map(line => line.match(/"(\d+)"/)?.[1])
        : lines.map(line => line.trim().split(/\s+/)[0]).filter(pid => !isNaN(Number(pid)));
    logger.action(`Extracted PIDs: ${JSON.stringify(pids)}`);
    pids.forEach(pid => {
        if (!pid)
            return;
        try {
            const killCommand = isWindows
                ? `taskkill /PID ${pid} /T /F`
                : `kill -9 ${pid}`;
            logger.info(`Running kill command: ${killCommand}`);
            const killResult = spawnSync(killCommand, { shell: true, encoding: 'utf-8' });
            if (killResult.error) {
                logger.error(`Failed to kill process with PID ${pid}: ${killResult.error.message}`);
            }
            else {
                logger.success(`Killed process with PID: ${pid}`);
            }
            if (!isWindows) {
                setTimeout(() => {
                    try {
                        process.kill(parseInt(pid, 10), 'SIGKILL');
                        logger.info(`Sent SIGKILL to process with PID: ${pid}`);
                    }
                    catch (killError) {
                        if (killError.code === 'ESRCH') {
                            logger.info(`Process with PID ${pid} already terminated.`);
                        }
                        else {
                            logger.error(`Failed to send SIGKILL to process with PID ${pid}: ${killError.message}`);
                        }
                    }
                }, 10000);
            }
        }
        catch (err) {
            logger.error(`Failed to kill process with PID ${pid}: ${err.message}`);
        }
    });
}
/**
 * Clean up and run a command before exiting the process.
 */
export function cleanupWatchers() {
    logger.info(`🧹 Cleaning up Watchman watchers...`);
    const cwd = process.cwd();
    const command = `watchman watch-del "${cwd}"`; // Adjust for Windows paths
    logger.info(`Cleaning watchers for directory: ${cwd}`);
    const result = spawnSync(command, { shell: true, encoding: 'utf-8' });
    return result;
}
//# sourceMappingURL=helpers.js.map