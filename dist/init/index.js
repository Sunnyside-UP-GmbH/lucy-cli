import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
import { init_expo } from "./expo.js";
import { selectTemplate } from "./templates.js";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { createLucyHome } from "../commands/home.js";
import { readLucyJsonFromTemplate } from "../commands/read.js";
import { init_monorepo } from "./monorepo.js";
import { init_cargo } from "./cargo.js";
import { init_blocks } from "./blocks.js";
import { init_velo } from "./velo.js";
import { init_submodules } from "./gitModules.js";
import { init_tauri } from "./tauri.js";
import { pkgManagers } from "../schemas/lucy.js";
//TODO: Update Local tsconfig for libs
//TODO: Fix PNPM in VELO
export const init = Effect.gen(function* (_) {
    const config = yield* Config;
    if (config.config.action.initType === undefined) {
        return yield* Effect.fail(new AppError({ message: "No init type provided", cause: new Error("No init type provided") }));
    }
    yield* createLucyHome();
    const projectName = config.config.cwd.split('/').pop() || 'expo-project';
    const templateQuestion = new Enquirer();
    const choice = yield* Effect.tryPromise({
        try: () => templateQuestion.prompt({
            type: 'input',
            name: 'projectName',
            message: 'Enter a project name',
            initial: projectName,
            validate: (value) => value.trim() !== '' ? true : 'Project name cannot be empty'
        }),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error selecting template' });
        }
    });
    const selectedName = yield* Schema.decodeUnknown(Schema.Struct({ projectName: Schema.String }))(choice);
    config.config.projectName = selectedName.projectName.trim();
    yield* selectTemplate();
    yield* readLucyJsonFromTemplate;
    function supportedPackageManagers() {
        if (config.config.action.initType === 'velo') {
            return pkgManagers.filter(pkgMgr => pkgMgr !== 'pnpm');
        }
        return pkgManagers;
    }
    const pkgMgrQuestion = new Enquirer();
    const pkgMgr = yield* Effect.tryPromise({
        try: () => pkgMgrQuestion.prompt({
            type: 'select',
            name: 'packageManager',
            message: 'Select a package manager',
            choices: [...supportedPackageManagers()],
        }),
        catch: (e) => {
            return new AppError({ cause: e, message: 'Error selecting package manager' });
        }
    });
    const selectedPkgMgr = yield* Schema.decodeUnknown(Schema.Struct({ packageManager: Schema.Literal(...pkgManagers) }))(pkgMgr);
    config.config.lucySettings.packageManager = selectedPkgMgr.packageManager;
    if (config.config.action.initType === 'expo') {
        return yield* init_expo();
    }
    if (config.config.action.initType === 'monorepo') {
        return yield* init_monorepo();
    }
    if (config.config.action.initType === 'cargo') {
        return yield* init_cargo();
    }
    if (config.config.action.initType === 'blocks') {
        return yield* init_blocks();
    }
    if (config.config.action.initType === 'tauri') {
        return yield* init_tauri();
    }
    if (config.config.action.initType === 'velo') {
        return yield* init_velo();
    }
    if (config.config.action.initType === 'submodules') {
        return yield* init_submodules();
    }
    yield* Effect.fail(new AppError({ message: `Unsupported init type: ${config.config.action.initType}`, cause: new Error(`Unsupported init type: ${config.config.action.initType}`) }));
});
//# sourceMappingURL=index.js.map