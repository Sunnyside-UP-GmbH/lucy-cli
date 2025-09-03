import { Effect, Schema } from "effect/index";
import { Config, lucyJsonName } from "../config.js";
import { Command, FileSystem, Path } from "@effect/platform";
import { JsonSchema } from "../schemas/index.js";
import { logger } from "../utils/logger.js";
import { mergeAdditions, mergeLucySettings2PackageJson, setInitialized } from "../commands/edit.js";
import { writeLucySettings, writePackageJson } from "../commands/write.js";
import { copyTemplateFiles } from "../commands/copy.js";
import { readPackageJson } from "../commands/read.js";
import { execCommand, openEditor } from "../commands/exec.js";
import { approveBuilds, installPackages } from "../commands/install.js";
import { AppError } from "../error.js";
import { cleanup } from "../commands/cleanup.js";
import { checkForDirty } from "../commands/checks.js";
export const init_blocks = () => {
    return Effect.gen(function* () {
        const config = yield* Config;
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        logger.action("Initializing Blocks project...");
        const configJsonRaw = yield* fs.readFile("wix.config.json").pipe(Effect.catchAll((error) => {
            return Effect.succeed('{}');
        }));
        const configJson = Schema.decodeUnknownSync(JsonSchema)(configJsonRaw.toString());
        const blocksAppReady = configJson.appId ? true : false;
        yield* checkForDirty();
        if (!blocksAppReady) {
            const initBlocks = Command.make("npm", "create", "@wix/app@latest", config.config.projectName).pipe(Command.stdin("inherit"), Command.stdout("inherit"), Command.stderr("inherit"), Command.exitCode);
            if ((yield* initBlocks) !== 0) {
                yield* Effect.fail(new AppError({ message: "Failed to initialize Blocks project. Please check the error message above.", cause: new Error("Failed to initialize Blocks project") }));
            }
            const files = yield* fs.readDirectory(config.config.cwd, { recursive: false });
            const allExcludes = ['.git', lucyJsonName];
            const filteredFiles = files.filter(file => !allExcludes.includes(file));
            const t = yield* fs.stat(filteredFiles[0]);
            t.type === 'Directory';
            const directories = yield* Effect.filter(filteredFiles, (file) => Effect.gen(function* () {
                const fullPath = path.join(config.config.cwd, file);
                const stat = yield* fs.stat(fullPath);
                return stat.type === "Directory";
            }));
            const tempPath = directories[0];
            const projectFiles = yield* fs.readDirectory(directories[0]);
            yield* Effect.forEach(projectFiles.filter(file => file !== '.git'), (file) => fs.copy(path.join(tempPath, file), path.join(config.config.cwd, file), { overwrite: true }), { discard: true });
            yield* fs.remove(tempPath, { recursive: true });
        }
        yield* readPackageJson;
        yield* mergeLucySettings2PackageJson;
        yield* mergeAdditions;
        yield* writeLucySettings;
        yield* writePackageJson;
        yield* copyTemplateFiles;
        yield* execCommand;
        yield* installPackages();
        yield* approveBuilds;
        yield* cleanup;
        yield* setInitialized;
        logger.success("Blocks project initialized successfully!");
        yield* openEditor;
    });
};
//# sourceMappingURL=blocks.js.map