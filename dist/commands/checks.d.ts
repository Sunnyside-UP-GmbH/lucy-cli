import { Effect } from "effect/index";
import { FileSystem, Path } from "@effect/platform";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const isDirectoryClean: (excludes?: string[]) => Effect.Effect<boolean, import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem>;
export declare const checkForDirty: (excludes?: string[]) => Effect.Effect<void, AppError | import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem>;
export declare const checkForVelo: () => Effect.Effect<undefined, AppError | import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | Path.Path>;
