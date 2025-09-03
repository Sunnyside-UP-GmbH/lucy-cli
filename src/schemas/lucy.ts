import { Schema } from "effect/index";
import { initTypes } from "./types.js";

export const pkgManagers = ['pnpm', 'yarn', 'npm'] as const;
export const lucySettings = Schema.mutable(Schema.Struct({
	modules: Schema.Record({
        key: Schema.String, 
        value: Schema.Struct({
		source: Schema.String,
		branch: Schema.String,
		path: Schema.optional(Schema.String),
		noCompile: Schema.optional(Schema.Boolean),
	})}),
	veloSettings: Schema.optional(Schema.NullOr(Schema.Struct({
		compilerOptions: Schema.optional(Schema.Struct({
			composite: Schema.Boolean,
			noEmit: Schema.Boolean,
			lib: Schema.Array(Schema.String),
			jsx: Schema.String,
		})),
		exclude: Schema.optional(Schema.Array(Schema.String)),
	}))),
	initialized: Schema.Boolean,
    type: Schema.Literal(...initTypes),
	dependencies: Schema.mutable(Schema.Record({
        key: Schema.String,
        value: Schema.String,
    })),
	devDependencies: Schema.mutable(Schema.Record({
        key: Schema.String,
        value: Schema.String,
    })),
	scripts: Schema.Record({
        key: Schema.String,
        value: Schema.String,
    }),
	additionalCommands: Schema.optional(Schema.Array(Schema.Array(Schema.String))),
	additionalPkgProps: Schema.optional(Schema.Object),
	packageManager: Schema.mutable(Schema.Literal(...pkgManagers)),
	defaultModulePath: Schema.optional(Schema.String),
}));

export type LucySettings = typeof lucySettings.Type;