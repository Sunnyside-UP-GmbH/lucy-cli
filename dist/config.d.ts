import { get_args } from "./args.js";
declare const Config_base: any;
export declare class Config extends Config_base {
}
export declare const packageJsonName = "package.json";
export declare const lucyJsonName = "lucy.json";
export declare const wixSyncJsonName = "wix-sync.json";
export declare const wixSDKSettingsJsonName = "wix-sdk-settings.json";
export declare const syncDataName = "sync-data";
export declare const packageJsonPath: any;
export declare const lucyJsonPath: any;
export declare const veloSyncJsonPath: any;
export declare const wixSDKSettingsJsonPath: any;
export declare const syncFilesSource: any;
export declare const ConfigLayer: (args: Awaited<ReturnType<typeof get_args>>) => any;
export {};
