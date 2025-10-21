import AsyncStorage from '@react-native-async-storage/async-storage';
import { Data, Effect, Schema } from 'effect';
import { fetch } from 'expo/fetch';

import { DataState, dataStateSchema, versionSchema } from '@/models';

import { BASE_URL, CACHE_CONTROL, STATE_KEY, USER_AGENT } from '../constants/config';
import { clearStorage } from './storage';

export class StateError extends Data.TaggedError('StateError')<{reason: string, error: unknown}> {}
export class GetVersionError extends Data.TaggedError('GetVersionError')<{reason: string, error: unknown}> {}

export const getState = Effect.gen(function* () {
	const rawState =yield* Effect.tryPromise({
		try: () => AsyncStorage.getItem(STATE_KEY),
		catch: (error) => {
			return new StateError({ reason: 'Failed to save state to storage', error });
		}
	});
	if(rawState === null) return null;

	const stateJSON = yield* Schema.decodeUnknown(Schema.parseJson())(rawState).pipe(Effect.catchAll((error) => {
		// eslint-disable-next-line no-console
		console.error('Error decoding quote from storage:', error);
		
		return Effect.gen(function* () {
			yield* clearStorage(STATE_KEY).pipe(Effect.catchAll((error) => {
				// eslint-disable-next-line no-console
				console.error('Error clearing storage:', error);
				
				return Effect.succeed(null);
			}));
			
			return yield* Effect.succeed(null);
		});
	}));

	const data = yield* Schema.decodeUnknown(dataStateSchema)(stateJSON).pipe(
		Effect.catchAll((error) => {
			// eslint-disable-next-line no-console
			console.error('Failed to decode state from storage:', error);
			
			return Effect.gen(function* () {
				yield* clearStorage(STATE_KEY).pipe(Effect.catchAll((error) => {
					// eslint-disable-next-line no-console
					console.error('Error clearing storage:', error);
					
					return Effect.succeed(null);
				}));
				
				return yield* Effect.succeed(null);
			});
		}
		)
	);
	
	return data;
});

export const setState = (state: DataState) => {
	return Effect.gen(function* () {
		yield* Effect.tryPromise({
			try: () => AsyncStorage.setItem(STATE_KEY, JSON.stringify(state)),
			catch: (error) => {
				// eslint-disable-next-line no-console
				console.error('Error saving state to storage:', error);
				
				return new StateError({ reason: 'Failed to save state to storage', error });
			}
		});
	});
};

export const removeState = Effect.gen(function* () {
	yield* Effect.tryPromise({
		try: () => AsyncStorage.removeItem(STATE_KEY),
		catch: (error) => {
			return new StateError({ reason: 'Failed to remove state to storage', error });
		}
	});
});


export const getVersionInfo = Effect.gen(function* () {
	const response = yield* Effect.tryPromise({
		try: () => fetch(BASE_URL.toString() + '/' + 'version.json', {
			headers: {
				'Cache-Control': CACHE_CONTROL,
				'user-agent': USER_AGENT,
			},
		}),
		catch: (error) => {
			return new StateError({
				reason: 'Failed to fetch state from remote',
				error,
			});
		},
	});

	if (!response.ok) {		
		return yield* Effect.fail(new StateError({
			reason: `Failed to fetch version: ${response.status} ${response.statusText}`,
			error: new Error(`Failed to fetch version: ${response.status} ${response.statusText}`),
		}));
	}
	const jsonVersion = yield* Effect.tryPromise({
		try: () => response.json(),
		catch: (error) => {
			return new GetVersionError({
				reason: 'Failed to decode remote state from JSON',
				error,
			});
		},
	});

	const version = yield* Schema.decodeUnknown(versionSchema)(jsonVersion, { onExcessProperty: 'ignore' }).pipe(
		Effect.catchAll((error) => {
			return Effect.fail(
				new GetVersionError({
					reason: 'Failed to decode state from remote state',
					error,
				}),
			);
		}),
	);	
	
	return version;
});