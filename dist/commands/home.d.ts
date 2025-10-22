import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const createLucyHome: () => Effect.Effect<void, import("@effect/platform/Error").PlatformError | import("../error.js").AppError, Config | FileSystem.FileSystem | Path.Path>;
