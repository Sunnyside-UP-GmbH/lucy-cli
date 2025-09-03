import { Schema } from "effect/index";

export const JsonSchema = Schema.parseJson()

export const veloSyncSettings = Schema.Struct({
	siteUrl: Schema.String,
	secret: Schema.String,
});
export type VeloSyncSettings = typeof veloSyncSettings.Type;

export const wixSDKSettings = Schema.Struct({
	apiKey: Schema.String,
	siteId: Schema.String,
});
export type WixSDKSettings = typeof wixSDKSettings.Type;

export const editors = ['vscode', 'cursor'] as const;
