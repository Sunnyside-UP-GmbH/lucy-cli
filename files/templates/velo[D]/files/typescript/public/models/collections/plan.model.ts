import { satisfies } from 'effect/Function';
import { Schema } from 'effect/index';

/**
 * Defines the base schema for a feature literal.
 */
export const futuresSchema = Schema.Literal('create_event', 'create_organization');

/**
 * Defines the base schema for a single subscription plan.
 */
export const planSchema = Schema.Struct({
	id: Schema.String,
	name: Schema.String,
	order: Schema.Number,
	features: Schema.Array(futuresSchema),
	limits: Schema.Struct({
		organizations: Schema.Number,
		events: Schema.Number,
	}),
});

/**
 * A derived TypeScript type for a Plan, for convenience.
 */
export type Plan = Schema.Schema.Type<typeof planSchema>;

/**
 * The static list of all available subscription plans.
 * This data is typed and validated against the planSchema at build time.
 * By keeping this in a separate file, we prevent circular dependencies.
 */
export const availablePlans = satisfies<Plan[]>()([
	{
		id: '00000000-0000-0000-0000-000000000000',
		name: 'free',
		order: 0,
		features: [ 'create_event', 'create_organization' ],
		limits: {
			organizations: 2,
			events: 1
		},
	},
	{
		id: '26b02e36-6d07-41d8-ae49-8241756b4270',
		name: '1 Jahr kostenlos',
		order: 1,
		features: ['create_event', 'create_organization'],
		limits: {
			organizations: 2,
			events: 1
		},
	},
	{
		id: 'a86edd6d-8d7e-468d-b763-838674cff834',
		name: 'Einsteiger',
		order: 2,
		features: ['create_event', 'create_organization'],
		limits: {
			organizations: 2,
			events: 1
		},
	},
	{
		id: '9c6b158e-2689-45c0-95a3-8c0e596a69ce',
		name: 'Hobby',
		order: 3,
		features: [],
		limits: {
			organizations: 2,
			events: 1
		},
	},
	{
		id: 'c7de837b-7463-4508-a89c-d7deec3fc9fd',
		name: 'Teilzeit',
		order: 4,
		features: ['create_event', 'create_organization'],
		limits: {
			organizations: 2,
			events: 1
		},
	},
	{
		id: 'c1e48401-1126-4834-be26-6fd5df9d5ffe',
		name: 'Vollzeit',
		order: 5,
		features: ['create_event', 'create_organization'],
		limits: {
			organizations: 2,
			events: 1
		},
	},
] as const);
