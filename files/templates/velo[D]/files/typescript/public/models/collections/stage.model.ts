import { Schema } from 'effect/index';
import { wixItemBaseSchema } from 'public/lib/models/wix/common/collection.model';


export const stageBaseSchema = Schema.Struct({
	name: Schema.String,
	description: Schema.String,
	color: Schema.String,
});

export const stageSchema = Schema.Struct({
	...wixItemBaseSchema.fields,
	...stageBaseSchema.fields,
});