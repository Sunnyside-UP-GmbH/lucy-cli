import { Schema } from 'effect';

export const versionSchema = Schema.Struct({
	version: Schema.String,
	languages: Schema.Array(Schema.String)
});
export type Version = typeof versionSchema.Type;

export const dataStateSchema = Schema.Struct({
	index: Schema.Number,
	date: Schema.DateTimeUtc,
	lastUpdateCheck: Schema.DateTimeUtc,
	language: Schema.String,
	deviceLanguage: Schema.String,
	version: Schema.String,
});
export type DataState = typeof dataStateSchema.Type;


export const quoteSchema = Schema.Struct({
	Verse: Schema.String,
	Reference: Schema.String,
	Topic: Schema.String,
});
export type Quote = typeof quoteSchema.Type;

const schema = Schema.parseJson();
const decode = Schema.decodeUnknown(schema);