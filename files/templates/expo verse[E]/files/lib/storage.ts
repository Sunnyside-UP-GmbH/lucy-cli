import AsyncStorage from '@react-native-async-storage/async-storage';
import { Data, Effect } from 'effect';

export class StorageError extends Data.TaggedError('StorageError')<{
	reason: string;
	error: unknown;
}> {}

export const clearStorage = (key: string) => {
	return Effect.gen(function* () {
		yield* Effect.tryPromise({
			try: () => AsyncStorage.removeItem(key),
			catch: (error) => {
				return new StorageError({ reason: 'Failed to clear storage', error });
			}
		});
	});};
