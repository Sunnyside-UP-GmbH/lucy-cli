import { Schema } from "effect/index";
export declare const pkgManagers: readonly ["pnpm", "yarn", "npm"];
export declare const lucySettings: Schema.mutable<Schema.Struct<{
    modules: Schema.Record$<typeof Schema.String, Schema.Struct<{
        source: typeof Schema.String;
        branch: typeof Schema.String;
        path: Schema.optional<typeof Schema.String>;
        noCompile: Schema.optional<typeof Schema.Boolean>;
    }>>;
    veloSettings: Schema.optional<Schema.NullOr<Schema.Struct<{
        compilerOptions: Schema.optional<Schema.Struct<{
            composite: typeof Schema.Boolean;
            noEmit: typeof Schema.Boolean;
            lib: Schema.Array$<typeof Schema.String>;
            jsx: typeof Schema.String;
        }>>;
        exclude: Schema.optional<Schema.Array$<typeof Schema.String>>;
    }>>>;
    initialized: typeof Schema.Boolean;
    type: Schema.Literal<["velo", "expo", "blocks", "monorepo", "tauri", "cargo", "submodules", "wix-sdk"]>;
    dependencies: Schema.mutable<Schema.Record$<typeof Schema.String, typeof Schema.String>>;
    devDependencies: Schema.mutable<Schema.Record$<typeof Schema.String, typeof Schema.String>>;
    scripts: Schema.Record$<typeof Schema.String, typeof Schema.String>;
    additionalCommands: Schema.optional<Schema.Array$<Schema.Array$<typeof Schema.String>>>;
    additionalPkgProps: Schema.optional<typeof Schema.Object>;
    packageManager: Schema.mutable<Schema.Literal<["pnpm", "yarn", "npm"]>>;
    defaultModulePath: Schema.optional<typeof Schema.String>;
}>>;
export type LucySettings = typeof lucySettings.Type;
