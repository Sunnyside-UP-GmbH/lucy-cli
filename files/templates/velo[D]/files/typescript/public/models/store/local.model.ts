import { tablesBaseSchema, valuesBaseSchema } from 'public/lib/models/store/local';

export const tablesSchema = {
	// pets: { species: { type: 'string' }, age: { type: 'number' }, puppie: { type: 'boolean' } },
	...tablesBaseSchema,
} as const;

export const valuesSchema = {
	...valuesBaseSchema,
} as const;