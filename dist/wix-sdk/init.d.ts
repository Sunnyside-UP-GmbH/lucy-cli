import { Effect } from "effect/index";
import { Config } from "../config.js";
import { AppError } from "../error.js";
export declare const wix_sdk_init: Effect.Effect<void, AppError | import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, Config | import("@effect/platform/FileSystem").FileSystem | import("@effect/platform/Path").Path>;
