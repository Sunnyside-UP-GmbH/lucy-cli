import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
import { AppError } from "../error.js";
export declare const init_velo: () => Effect.Effect<void, AppError | import("@effect/platform/Error").PlatformError | import("effect/ParseResult").ParseError, Config | FileSystem.FileSystem | Path.Path | import("@effect/platform/CommandExecutor").CommandExecutor>;
