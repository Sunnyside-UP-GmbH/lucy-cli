import { Schema } from 'effect';
import { wixItemBaseSchema } from 'public/lib/models/wix/common/collection.model';
import { addressSchema, mediaGallerySchema } from 'public/lib/models/wix/common/common.model';

import { subscriptionsSchema } from './subscriptions.model';

export const organizationBaseSchema = Schema.Struct({
	name: Schema.String,
	description: Schema.String,
	location: addressSchema,
	phone: Schema.optional(Schema.String),
	website: Schema.optional(Schema.String),
	logo: Schema.String,
	media_gallery: mediaGallerySchema,
	subscription: subscriptionsSchema,
	slug: Schema.optional(Schema.String),
	usage: Schema.String,
	validated: Schema.Boolean,
	email: Schema.String,
	watch: Schema.Boolean,
	flagged: Schema.Boolean,
	threshold: Schema.Number,
	stage: Schema.String,
});


// export class OrganizationSchema extends Schema.Class<OrganizationSchema>('OrganizationSchema')(
// 	{
// 		...wixItemBaseSchema.fields,
// 		...organizationBaseSchema.fields,
// 	}
// ) {}
export const organizationSchema = Schema.Struct({
	...wixItemBaseSchema.fields,
	...organizationBaseSchema.fields,
});

export const organizationsItemsSchema = Schema.Array(organizationSchema);