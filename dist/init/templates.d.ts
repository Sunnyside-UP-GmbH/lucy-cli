import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem } from "@effect/platform";
import { AppError } from "../error.js";
export declare const selectTemplate: () => Effect.Effect<undefined, AppError | import("@effect/platform/Error").PlatformError | import("effect/ParseResult").ParseError, Config | FileSystem.FileSystem>;
