import { Effect } from "effect/index";
import { Config } from "../config.js";
import { FileSystem, Path } from "@effect/platform";
export declare const createLucyHome: () => Effect.Effect<void, any, Config | FileSystem.FileSystem | Path.Path>;
