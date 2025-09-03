import { Effect, Schema } from "effect/index"
import { logger } from "../utils/logger.js";
import { writeLucySettings } from "../commands/write.js";
import { copyTemplateFiles } from "../commands/copy.js";
import { gitInit } from "../commands/git.js";
import { checkForDirty } from "../commands/checks.js";
import { setInitialized } from "../commands/edit.js";
import { Config } from "../config.js";
import { Command, FileSystem, Path } from "@effect/platform"
import { AppError } from "../error.js";
import { approveBuilds, installPackages } from "../commands/install.js";
import { openEditor } from "../commands/exec.js";

export const init_tauri = () => {
    return Effect.gen(function*() {
        const config = yield* Config;
        logger.action("Initializing Tauri project...");

        yield* checkForDirty();

        const initTauri = Command.make("yarn", "create", "tauri-app", config.config.projectName).pipe(
            Command.stdin("inherit"),
            Command.stdout("inherit"),
            Command.stderr("inherit"),
            Command.runInShell(true),
            Command.exitCode
        )
        if((yield* initTauri) !== 0) {
            yield* Effect.fail(new AppError({ message: "Failed to initialize Tauri project. Please check the error message above.", cause: new Error("Failed to initialize Tauri project") }));
        }
        yield* copyTemplateFiles;
        yield* installPackages();
        yield* approveBuilds;
        yield* writeLucySettings;
        yield* gitInit();
        yield* setInitialized;

        logger.success("Tauri project initialized successfully!");

        yield* openEditor;
    })
}
