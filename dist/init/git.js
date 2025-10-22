import { Effect } from "effect/index";
import { logger } from "../utils/logger.js";
import { setInitialized } from "../commands/edit.js";
import { gitInit } from "../commands/git.js";
export const sync_templates = () => {
    return Effect.gen(function* () {
        logger.action("Syncing templates...");
        yield* gitInit(true);
        yield* setInitialized;
        logger.success("GIT initialized successfully!");
    });
};
//# sourceMappingURL=git.js.map