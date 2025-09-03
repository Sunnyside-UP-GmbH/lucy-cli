import { Effect, Schema } from "effect/index"
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform"
import { logger } from "../utils/logger.js";
import { mergeAdditions, mergeLucySettings2PackageJson, setInitialized, setProjectName, stringReplace } from "../commands/edit.js";
import { writeLucySettings, writePackageJson } from "../commands/write.js";
import { copyTemplateFiles } from "../commands/copy.js";
import { readPackageJson } from "../commands/read.js";
import { installVeloPackages, runInstall, yarnSetVersion } from "../commands/install.js";
import { cleanup } from "../commands/cleanup.js";
import { gitInit } from "../commands/git.js";
import { checkForVelo } from "../commands/checks.js";
import { AppError } from "../error.js";
import Enquirer from "enquirer";
import { prepareVelo } from "./prepareVelo.js";
import { openEditor } from "../commands/exec.js";

export const init_velo = () => {
    return Effect.gen(function*() {
        const config = yield* Config;
        const path = yield* Path.Path;

        logger.action("Initializing Velo...");

        yield* checkForVelo();

        if(config.config.lucySettings.initialized && !config.config.force) {
            const question = new Enquirer();
            const choice = yield* Effect.tryPromise({
                try: () => question.prompt({
                    type: 'confirm',
                    name: 'prepare',
                    message: 'Do you want to prepare the velo project?(install packages, git init)',
                }),
                catch: (e) => {
                    return new AppError({ cause: e, message: 'Error selecting template' });
                }
            })
            const prepare = yield* Schema.decodeUnknown(Schema.Struct({ prepare: Schema.Boolean }))(choice)
            if(prepare.prepare) return yield* prepareVelo
        }


        if(config.config.lucySettings.initialized && !config.config.force) return yield* Effect.fail(new AppError({ message: "Lucy is already initialized in this directory. Use --force to reinitialize.", cause: new Error("Lucy is already initialized in this directory") }));
        if ((config.config.lucySettings.initialized && config.config.force) || (config.config.lucySettings.initialized && config.config.force)) logger.alert("Forced initialization!");
        
        yield* copyTemplateFiles;
        yield* stringReplace(path.join(config.config.cwd, 'currents.config.js'), ['__ProjectName__'], [config.config.projectName]);
        yield* readPackageJson;
        yield* setProjectName;
        yield* mergeLucySettings2PackageJson;
        yield* mergeAdditions;
        yield* writeLucySettings;
        yield* writePackageJson;
        yield* gitInit();
        yield* runInstall;
        yield* installVeloPackages;
        yield* runInstall;
        yield* cleanup;
        yield* setInitialized;
        
        logger.success("Velo initialized successfully!");

        yield* openEditor;
    })
}
