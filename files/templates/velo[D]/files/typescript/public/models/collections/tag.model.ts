import { Schema } from 'effect/index';
import { wixItemBaseSchema } from 'public/lib/models/wix/common/collection.model';

export const tagBaseSchema = Schema.Struct({
	name: Schema.String,
	description: Schema.String,
	image: Schema.String,
});

export const tagSchema = Schema.Struct({
	...wixItemBaseSchema.fields,
	...tagBaseSchema.fields,
});

export const tagsSchema = Schema.Array(tagSchema);