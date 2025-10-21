import { tablesBaseSchema, valuesBaseSchema } from 'public/lib/models/store/session';

export const tablesSchema = {
	...tablesBaseSchema,
} as const;

export const valuesSchema = {
	...valuesBaseSchema,
} as const;

