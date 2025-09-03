import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
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
export const init_expo = () => {
    return Effect.gen(function* () {
        const config = yield* Config;
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;
        logger.action("Initializing Expo project...");
        const appJsonRaw = yield* fs.readFile("app.json").pipe(Effect.catchAll((error) => {
            return Effect.succeed('{}');
        }));
        const appJSON = Schema.decodeUnknownSync(JsonSchema)(appJsonRaw.toString());
        const expoAppReady = appJSON.expo ? true : false;
        yield* checkForDirty();
        if (!expoAppReady) {
            const initExpo = Command.make("npx", "create-expo-app@latest", config.config.projectName, "--template", "blank-typescript", "--no-install").pipe(Command.stdout("inherit"), Command.stderr("inherit"), Command.exitCode);
            if ((yield* initExpo) !== 0) {
                yield* Effect.fail(new AppError({ message: "Failed to initialize Expo project. Please check the error message above.", cause: new Error("Failed to initialize Expo project") }));
            }
            const tempPath = path.join(config.config.cwd, config.config.projectName);
            const projectFiles = yield* fs.readDirectory(tempPath);
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
        logger.success("Expo project initialized successfully!");
        yield* openEditor;
    });
};
//# sourceMappingURL=expo.js.map