import { BackendConfig } from 'backend/lib/config/model';
import { satisfies } from 'effect/Function';
import { config as publicConfig } from 'public/config';
import { LooseAutocomplete } from 'public/lib/models/helpers';

import { authzConfig } from './authz';
import { environment } from './env';
import { mailConfig } from './mail';
import { natsConfig } from './nats';


export const config = satisfies<BackendConfig>()({
	...publicConfig,
	...environment,
	authz: authzConfig,
	mail: mailConfig,
	nats: natsConfig,
	development: process.env.SEGMENT === 'dev',
	collections: ['organizations'],
	secrets: [ 'jwtSecret', 'velo-sync', 'nats-creds', 'license-service-key', 'smtp-user', 'smtp-password' ],

} as const);


export type ConfigSchema = typeof config;
export type SecretNames = LooseAutocomplete<typeof config.secrets[number]>;