import { Effect } from 'effect';

import { STATE_KEY, STORAGE_KEY } from '../constants/config';
import { getQuotes } from './data';
import { getState, removeState } from './state';
import { clearStorage } from './storage';


export const clearData = Effect.gen(function* () {
	yield* Effect.log('Clearing data');
	yield* removeState;
	yield* clearStorage(STORAGE_KEY);
	yield* clearStorage(STATE_KEY);
});

export const showData = Effect.gen(function* () {
	yield* Effect.log('Showing data');
	const state = yield* getState;
	const data = yield* getQuotes();
	yield* Effect.log({ data, state });
});
