import { Context, Layer } from "effect";
import { get_args } from "./args.js";
import { LucySettings } from "./schemas/lucy.js";
import { Actions } from "./schemas/types.js";
import { VeloSyncSettings, WixSDKSettings } from "./schemas/index.js";
declare const Config_base: Context.TagClass<Config, "Config", {
    readonly config: {
        readonly action: Actions;
        readonly force: boolean;
        readonly cwd: string;
        readonly packageRoot: string;
        readonly filesFolder: string;
        readonly veloSyncArguments?: {
            data?: string;
            collection?: string;
            schema?: string;
            dry: boolean;
        };
        packageJson: any;
        lucySettings: LucySettings;
        readonly lucyHome: string;
        templateDir: string;
        templateFiles: string;
        projectName: string;
        veloSyncSettings?: VeloSyncSettings;
        wixSDKSettings?: WixSDKSettings;
    };
}>;
export declare class Config extends Config_base {
}
export declare const packageJsonName = "package.json";
export declare const lucyJsonName = "lucy.json";
export declare const wixSyncJsonName = "wix-sync.json";
export declare const wixSDKSettingsJsonName = "wix-sdk-settings.json";
export declare const syncDataName = "sync-data";
export declare const packageJsonPath: string;
export declare const lucyJsonPath: string;
export declare const veloSyncJsonPath: string;
export declare const wixSDKSettingsJsonPath: string;
export declare const syncFilesSource: string;
export declare const ConfigLayer: (args: Awaited<ReturnType<typeof get_args>>) => Layer.Layer<Config, import("effect/ParseResult").ParseError | import("@effect/platform/Error").PlatformError, never>;
export {};
