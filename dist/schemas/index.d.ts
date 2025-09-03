import { Schema } from "effect/index";
export declare const JsonSchema: Schema.SchemaClass<unknown, string, never>;
export declare const veloSyncSettings: Schema.Struct<{
    siteUrl: typeof Schema.String;
    secret: typeof Schema.String;
}>;
export type VeloSyncSettings = typeof veloSyncSettings.Type;
export declare const wixSDKSettings: Schema.Struct<{
    apiKey: typeof Schema.String;
    siteId: typeof Schema.String;
}>;
export type WixSDKSettings = typeof wixSDKSettings.Type;
export declare const editors: readonly ["vscode", "cursor"];
