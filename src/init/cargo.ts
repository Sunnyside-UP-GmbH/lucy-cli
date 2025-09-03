import { Effect } from "effect/index"
import { logger } from "../utils/logger.js";
import { writeLucySettings } from "../commands/write.js";
import { copyTemplateFiles } from "../commands/copy.js";
import { gitInit } from "../commands/git.js";
import { checkForDirty } from "../commands/checks.js";
import { setInitialized } from "../commands/edit.js";
import { openEditor } from "../commands/exec.js";

export const init_cargo = () => {
    return Effect.gen(function*() {
        logger.action("Initializing Cargo project...");

        yield* checkForDirty();

        yield* copyTemplateFiles;
        yield* writeLucySettings;
        yield* gitInit();
        yield* setInitialized;
        
        logger.success("Cargo project initialized successfully!");

        yield* openEditor;
    })
}
