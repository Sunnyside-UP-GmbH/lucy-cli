import { Effect } from "effect/index";
import { Config } from "../config.js";
export declare const init: Effect.Effect<void, any, Config | import("@effect/platform/FileSystem").FileSystem | import("@effect/platform/CommandExecutor").CommandExecutor | import("@effect/platform/Path").Path>;
