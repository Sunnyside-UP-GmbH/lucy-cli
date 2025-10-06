import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const init_monorepo: () => Effect.Effect<void, import("@effect/platform/Error").PlatformError | import("../error.js").AppError | import("effect/ParseResult").ParseError, Config | FileSystem.FileSystem | import("@effect/platform/CommandExecutor").CommandExecutor | Path.Path>;
