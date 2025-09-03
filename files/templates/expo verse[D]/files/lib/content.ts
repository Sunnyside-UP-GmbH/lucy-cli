import { Data, Effect } from 'effect';

import { FALLBACK_QUOTE } from '../constants/config';
import { getQuote, loadData } from './data';
import { getTimeData, renewState } from './helper';
import { setState } from './state';

export class ContentNotFoundError extends Data.TaggedError('ContentNotFoundError')<{reason: string}> {}

export const getContent = () => {
	return Effect.gen(function* () {
		const { quoteTimestamp } = yield* getTimeData;
		const { state } = yield* loadData;

		if(state === null) return yield* Effect.succeed(FALLBACK_QUOTE);

		if(yield* renewState(state)) {
			const { quote, randomIndex } = yield* getQuote();
			yield* setState({ ...state, index: randomIndex, date: quoteTimestamp }).pipe(Effect.catchAll((error) => Effect.logError('Failed to set state', error)));
			
			return quote;
		}
		const { quote } = yield* getQuote(state.index);
		
		return quote;
	}).pipe(Effect.catchTags({
		GetDataError: () => Effect.succeed(FALLBACK_QUOTE),
		ParseError: () => Effect.succeed(FALLBACK_QUOTE),
	}));
};

