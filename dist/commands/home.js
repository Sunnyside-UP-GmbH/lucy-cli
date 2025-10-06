import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
import { logger, orange } from "../utils/logger.js";
import path from 'path';
export const createLucyHome = () => {
    return Effect.gen(function* () {
        const config = yield* Config;
        const fs = yield* FileSystem.FileSystem;
        const p = yield* Path.Path;
        if (!(yield* fs.exists(config.config.lucyHome))) {
            logger.action(`Creating Lucy home directory at ${orange(config.config.lucyHome)}`);
            yield* fs.makeDirectory(config.config.lucyHome, { recursive: true });
        }
        const templateFiles = yield* fs.readDirectory(config.config.filesFolder);
        const shouldExclude = (relativePath) => {
            const segments = relativePath.split(/[/\\]/);
            return segments.includes("node_modules") || segments.includes("Pods");
        };
        const copyDirFiltered = (src, dest, base) => Effect.gen(function* () {
            const entries = yield* fs.readDirectory(src);
            yield* fs.makeDirectory(dest, { recursive: true });
            yield* Effect.forEach(entries, (entry) => Effect.gen(function* () {
                const from = p.join(src, entry);
                const to = p.join(dest, entry);
                const rel = base ? p.relative(base, from) : entry;
                if (shouldExclude(rel)) {
                    return;
                }
                const stat = yield* fs.stat(from);
                if (stat.type === "Directory") {
                    yield* copyDirFiltered(from, to, base ?? src);
                    return;
                }
                yield* fs.copyFile(from, to);
            }), { discard: true });
        });
        yield* Effect.forEach(templateFiles, (file) => copyDirFiltered(path.join(config.config.filesFolder, file), path.join(config.config.lucyHome, file)), { discard: true });
    });
};
//# sourceMappingURL=home.js.map