import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform"
import { logger, orange } from "../utils/logger.js";
import path, { join } from 'path';
import { gitSyncTemplates } from "./git.js";

export const createLucyHome = () => {
    return Effect.gen(function*() {
        const config = yield* Config
        const fs = yield* FileSystem.FileSystem
        const p = yield* Path.Path

        if(!(yield* fs.exists(config.config.lucyHome))) {
            logger.action(`Creating Lucy home directory at ${orange(config.config.lucyHome)}`);
            yield* fs.makeDirectory(config.config.lucyHome, { recursive: true });
        }
        yield* gitSyncTemplates();
    });
}