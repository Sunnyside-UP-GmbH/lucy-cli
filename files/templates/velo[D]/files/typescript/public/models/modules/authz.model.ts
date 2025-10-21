import { Schema } from 'effect/index';
import { jwtBaseSchema } from 'public/lib/models/dto/jwt.mode';

import { Roles } from '../../config';
import { availablePlans, planSchema } from '../collections/subscriptions.model';

export const subscriptionSchema = Schema.Union(planSchema);
export type Subscription = typeof subscriptionSchema.Type;
export const organizationDetails = Schema.Struct({
	organizationId: Schema.String,
	organizationSlug: Schema.optional(Schema.String),
	organizationSubscriptionId: Schema.Literal(...availablePlans.map(plan => plan.id)),
	roles: Schema.mutable(Schema.Array(Schema.Enums(Roles))),
});

export const rolesByOrgCollectionSchema = Schema.Struct({
	user: Schema.Struct({
		id: Schema.String,
		subscription: Schema.NullOr(subscriptionSchema),
	}),
	organizations: Schema.Array(organizationDetails),
	isSuperAdmin: Schema.Boolean,
});
export type AuthzData = typeof rolesByOrgCollectionSchema.Type;

export const jwtSchema = Schema.Struct({
	...jwtBaseSchema.fields,
	...rolesByOrgCollectionSchema.fields,
});

//Schema.optional(Schema.Union(...availablePlans.map(plan => Schema.Literal(typeof plan))))