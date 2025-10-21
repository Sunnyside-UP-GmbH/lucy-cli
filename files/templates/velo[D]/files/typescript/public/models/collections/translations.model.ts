import { Schema } from 'effect/index';
import { wixItemBaseSchema } from 'public/lib/models/wix/common/collection.model';

export const translationBaseSchema = Schema.Struct({
	key: Schema.String,
	language: Schema.String,
	text: Schema.optional(Schema.String),
	rich_text: Schema.optional(Schema.String),
	rich_content: Schema.optional(Schema.String),
});

export const translationSchema = Schema.Struct({
	...wixItemBaseSchema.fields,
	...translationBaseSchema.fields,
});
export const translationsSchema = Schema.Array(translationSchema);