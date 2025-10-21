import { tablesBaseSchema, valuesBaseSchema } from 'public/lib/models/store/memory';

export const tablesSchema = {
	// pets: { species: { type: 'string' } },
	...tablesBaseSchema,
} as const;

export const valuesSchema = {
	...valuesBaseSchema,
} as const;
