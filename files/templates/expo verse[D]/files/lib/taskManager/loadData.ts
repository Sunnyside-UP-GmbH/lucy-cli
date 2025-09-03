import { Effect } from 'effect';

import { loadData } from '../data';


export const backgroundTask = (ready: Promise<void>) => {
	return Effect.gen(function* () {
		yield* Effect.promise(() => ready);
		yield* Effect.log('Loading data');

		yield* loadData;
		
	});
};