import { satisfies } from 'effect/Function';
import { Effect, Schedule } from 'effect/index';
import { PublicConfig } from 'public/lib/config/model';
import { parseError } from 'public/lib/error';
import { isDataError } from 'public/lib/error/data';

import { environment } from './env';
import { defaultLocale } from './locales';

const simpleSchedule = Schedule.fromDelays(50, 100, 200, 400, 800);

const advancedSchedule = Schedule.intersect(
	Schedule.addDelay(
		Schedule.recurWhileEffect((e) =>
			Effect.gen(function* () {
				if (typeof e === 'object' && e !== null && 'cause' in e) {
					if (isDataError(e.cause)) {
						const errorCodes = [
							'WDE0028',
							'WDE0053',
							'WDE0054',
							'WDE0055',
							'WDE0110',
							'WDE0115',
							'WDE0116',
							'WDE0128',
							'WDE0149',
							'WDE0178',
							'WDE0180',
						];
						if (errorCodes.includes(e.cause.code)) {
							yield* Effect.logWarning('Retrying due to known error:', e);

							return true;
						}
					}
				}

				yield* Effect.logDebug('Not retrying due to error:', parseError(e));

				return false;
			}),
		),
		() => 50,
	),
	Schedule.fromDelays(100, 200, 400, 800, 1600, 2000),
);

export enum Roles {
  SUPER_ADMIN = 'super_admin',
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VISITOR = 'visitor',
}

export const config = satisfies<PublicConfig<typeof Roles>>()({
	...environment,
	defaultTimeZone: 'Europe/Zurich',
	defaultLanguage: defaultLocale,
	languageField: 'language_id',
	name: 'yeva',
	stateVersion: '0.0.1',
	persistErrors: false,
	frontendDevMode: true,
	simpleRetryPolicy: simpleSchedule,
	advancedRetryPolicy: advancedSchedule,
	roles: Roles,
	urlSchema: {
		targetPos: 1,
		actionPos: 2,
		resource: 0,
	},
} as const);

export type ConfigSchema = typeof config;
