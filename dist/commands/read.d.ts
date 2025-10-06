import { Effect } from "effect/index";
import { FileSystem, Path } from "@effect/platform";
import { Config } from "../config.js";
export declare const readPackageJson: Effect.Effect<void, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | Path.Path>;
export declare const readLucyJsonFromTemplate: Effect.Effect<void, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem | Path.Path>;
export declare const readVeloSyncSettings: Effect.Effect<void, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, Config | FileSystem.FileSystem>;
