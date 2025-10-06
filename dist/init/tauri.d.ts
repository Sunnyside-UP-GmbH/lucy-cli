import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
import { AppError } from "../error.js";
export declare const init_tauri: () => Effect.Effect<void, import("@effect/platform/Error").PlatformError | AppError | import("effect/ParseResult").ParseError, Config | FileSystem.FileSystem | import("@effect/platform/CommandExecutor").CommandExecutor | Path.Path>;
