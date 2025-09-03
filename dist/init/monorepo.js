import { Effect } from "effect/index";
import { Config } from "../config.js";
import { Command, FileSystem, Path } from "@effect/platform";
import { logger } from "../utils/logger.js";
import { mergeAdditions, mergeLucySettings2PackageJson, setInitialized, setProjectName, stringReplace } from "../commands/edit.js";
import { writeLucySettings, writePackageJson } from "../commands/write.js";
import { copyTemplateFiles } from "../commands/copy.js";
import { readPackageJson } from "../commands/read.js";
import { approveBuilds, installPackages, runInstall } from "../commands/install.js";
import { cleanup } from "../commands/cleanup.js";
import { gitInit } from "../commands/git.js";
import { checkForDirty } from "../commands/checks.js";
import { openEditor } from "../commands/exec.js";
export const init_monorepo = () => {
    return Effect.gen(function* () {
        const config = yield* Config;
        const path = yield* Path.Path;
        const fs = yield* FileSystem.FileSystem;
        logger.action("Initializing monorepo...");
        yield* checkForDirty();
        const createMonoRepo = Command.make("npx", "-y", "create-nx-workspace", config.config.projectName, `--appName=${config.config.projectName}`, `--pm=${config.config.lucySettings.packageManager}`, "--preset=ts", "--g=true", "--e2eTestRunner=cypress", "--formatter=prettier").pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
        Command.stderr("inherit"), // Stream stderr to process.stderr
        Command.exitCode // Get the exit code
        );
        yield* createMonoRepo;
        const tempPath = path.join(config.config.cwd, config.config.projectName);
        const projectFiles = yield* fs.readDirectory(tempPath);
        yield* Effect.forEach(projectFiles.filter(file => file !== '.git'), (file) => fs.copy(path.join(tempPath, file), path.join(config.config.cwd, file), { overwrite: true }), { discard: true });
        yield* fs.remove(tempPath, { recursive: true });
        yield* copyTemplateFiles;
        yield* stringReplace(path.join(config.config.cwd, 'currents.config.ts'), ['__ProjectName__'], [config.config.projectName]);
        yield* readPackageJson;
        yield* setProjectName;
        yield* mergeLucySettings2PackageJson;
        yield* mergeAdditions;
        yield* writeLucySettings;
        yield* writePackageJson;
        yield* gitInit();
        yield* runInstall;
        yield* installPackages(true);
        yield* approveBuilds;
        yield* cleanup;
        yield* setInitialized;
        logger.success("Monorepo initialized successfully!");
        yield* openEditor;
    });
};
//# sourceMappingURL=monorepo.js.map