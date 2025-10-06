import { Effect } from 'effect/index';
import { SimpleGit } from 'simple-git';
import { Config } from '../config.js';
import { AppError } from '../error.js';
import { FileSystem, Path } from "@effect/platform";
export declare const isSubmoduleRegistered: (git: SimpleGit, submoduleName: string) => Effect.Effect<boolean, AppError, never>;
export declare const gitInit: (update?: boolean) => Effect.Effect<void, AppError | import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | Path.Path>;
export declare const initSubmodules: (update?: boolean) => Effect.Effect<void, AppError | import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | Path.Path>;
