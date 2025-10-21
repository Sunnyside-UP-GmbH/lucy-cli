import { Schema } from 'effect/index';
import { wixItemBaseSchema } from 'public/lib/models/wix/common/collection.model';

import { organizationSchema } from './organization.model';

export const memberRolesSchema = Schema.Struct({
	key: Schema.String,
	account: Schema.String,
	roles: Schema.Array(Schema.String),
});

export const memberRolesWithOrgSchema = Schema.Struct({
	...wixItemBaseSchema.fields,
	key: Schema.String,
	account: Schema.String,
	roles: Schema.Array(Schema.String),
	organizations_members: organizationSchema,
});


export const memberRolesWithOrgCollectionSchema = Schema.mutable(Schema.Array(memberRolesWithOrgSchema));