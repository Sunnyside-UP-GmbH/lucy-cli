import { Effect } from 'effect/index';
import { simpleGit } from 'simple-git';
import { Config } from '../config.js';
import { AppError } from '../error.js';
import { logger } from '../utils/logger.js';
import { FileSystem, Path } from "@effect/platform";
export const isSubmoduleRegistered = (git, submoduleName) => Effect.gen(function* () {
    const value = yield* Effect.tryPromise({
        try: () => git.getConfig(`submodule.${submoduleName}.url`),
        catch: (error) => {
            return new AppError({
                cause: error,
                message: "Failed to get submodule url",
            });
        }
    });
    return !!value.value;
});
export const gitInit = (update = false) => Effect.gen(function* () {
    const config = yield* Config;
    const git = simpleGit({ baseDir: config.config.cwd });
    const path = yield* Path.Path;
    const isGit = yield* Effect.tryPromise({
        try: () => git.checkIsRepo(),
        catch: (error) => {
            return new AppError({
                cause: error,
                message: "Failed to check if the directory is a git repository",
            });
        }
    });
    if (!isGit) {
        yield* Effect.tryPromise({
            try: () => git.init(),
            catch: (error) => {
                return new AppError({
                    cause: error,
                    message: "Failed to initialize git repository",
                });
            }
        });
    }
    if (!config.config.lucySettings.modules) {
        logger.alert('No submodules defined in settings, skipping.');
        return;
    }
    yield* initSubmodules(update);
});
export const initSubmodules = (update = false) => Effect.gen(function* () {
    const config = yield* Config;
    const git = simpleGit({ baseDir: config.config.cwd });
    const path = yield* Path.Path;
    const fs = yield* FileSystem.FileSystem;
    const gitmodulesPath = path.join(config.config.cwd, ".gitmodules");
    for (const [name, repo] of Object.entries(config.config.lucySettings.modules)) {
        logger.action(`Processing submodule ${name}`);
        const clonePath = repo.path || path.join(config.config.lucySettings.defaultModulePath ?? '', name);
        const isRegistered = yield* isSubmoduleRegistered(git, clonePath);
        const isConfiguredInFile = (yield* fs.exists(gitmodulesPath)) && (yield* fs.readFileString(gitmodulesPath, 'utf-8')).includes(`[submodule "${clonePath}"]`);
        if (!isConfiguredInFile || config.config.force) {
            logger.action(`Adding/updating submodule ${name} at ${clonePath}...`);
            // If git already has a config entry, we must use --force to repair it.
            const submoduleArgs = () => {
                if (update) {
                    return ['add', '--force', repo.source, clonePath];
                }
                return ['add', ...(config.config.force || isRegistered ? ['--force'] : []), repo.source, clonePath];
            };
            // await git.subModule(submoduleArgs);
            yield* Effect.tryPromise({
                try: () => git.subModule(submoduleArgs()),
                catch: (error) => {
                    return new AppError({
                        cause: error,
                        message: "Failed to add submodule",
                    });
                }
            });
        }
        else {
            logger.alert(`Submodule ${name} at ${clonePath} already registered. Skipping add.`);
        }
        yield* Effect.tryPromise({
            try: () => git.submoduleUpdate(['--init', '--recursive', clonePath]),
            catch: (error) => {
                return new AppError({
                    cause: error,
                    message: "Failed to update submodule",
                });
            }
        });
        yield* Effect.tryPromise({
            try: () => simpleGit({ baseDir: path.join(config.config.cwd, clonePath) }).checkout(repo.branch),
            catch: (error) => {
                return new AppError({
                    cause: error,
                    message: `Failed to checkout submodule ${repo} branch ${repo.branch}`,
                });
            }
        });
    }
    logger.success("All modules processed!");
});
export const gitSyncTemplates = (update = false) => Effect.gen(function* () {
    const config = yield* Config;
    const path = yield* Path.Path;
    const templatesPath = path.join(config.config.lucyHome, 'templates');
    const fs = yield* FileSystem.FileSystem;
    const exists = yield* fs.exists(templatesPath);
    if (!exists) {
        const git = simpleGit({ baseDir: path.join(config.config.lucyHome) });
        console.log('cloning templates repository');
        yield* Effect.tryPromise({
            try: () => git.clone('https://github.com/Sunnyside-UP-GmbH/lucy-templates.git', 'templates'),
            catch: (error) => {
                console.log(error);
                return new AppError({
                    cause: error,
                    message: "Failed to clone templates repository",
                });
            }
        });
    }
    if (exists) {
        const git = simpleGit({ baseDir: path.join(config.config.lucyHome, 'templates') });
        yield* Effect.tryPromise({
            try: () => git.pull(),
            catch: (error) => {
                console.log(error);
                return new AppError({
                    cause: error,
                    message: "Failed to pull templates repository",
                });
            }
        });
    }
});
//# sourceMappingURL=git.js.map