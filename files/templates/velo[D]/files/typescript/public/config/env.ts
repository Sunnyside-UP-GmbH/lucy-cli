import { satisfies } from 'effect/Function';
import { PublicEnvironment } from 'public/lib/config/model';

export const environment = satisfies<PublicEnvironment>()({
	gitTag: 'development',
	debug: true,
} as const);

export type Environment = typeof environment;