import { BackendEnvironment } from 'backend/lib/config/model';
import { satisfies } from 'effect/Function';

export const environment = satisfies<BackendEnvironment>()({
	development: process.env.SEGMENT === 'dev' ? true : false,
} as const);

export type Environment = typeof environment;