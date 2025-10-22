import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const init_monorepo: () => Effect.Effect<void, import("../error.js").AppError | import("@effect/platform/Error").PlatformError | import("effect/ParseResult").ParseError, Config | Path.Path | FileSystem.FileSystem | import("@effect/platform/CommandExecutor").CommandExecutor>;
