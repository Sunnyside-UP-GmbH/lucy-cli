import AsyncStorage from '@react-native-async-storage/async-storage';
import { Data, Effect, Schema } from 'effect';
import { getLocales } from 'expo-localization';
import Papa from 'papaparse';

import { Quote, quoteSchema } from '@/models';

import { BASE_URL, CACHE_CONTROL, STORAGE_KEY, USER_AGENT } from '../constants/config';
import { checkUpdata, getLanguage, getTimeData, hasLanguageChanged, renewState } from './helper';
import { getState, getVersionInfo, setState } from './state';

export class GetRemoteDataError extends Data.TaggedError('GetRemoteDataError')<{reason: string, error: unknown}> {}
export class GetQuoteError extends Data.TaggedError('GetDataError')<{reason: string, error: unknown}> {}
export class SaveQuoteError extends Data.TaggedError('SaveQuoteError')<{reason: string, error: unknown}> {}

export const getRemoteData = (lang: string) => Effect.gen(function* () {
	const response = yield* Effect.tryPromise({
		try: () => fetch(`${BASE_URL.toString()}/${lang}.csv`, {
			headers: {
				'Cache-Control': CACHE_CONTROL,
				'user-agent': USER_AGENT,
			},
		}),
		catch: (error) => {			
			return new GetRemoteDataError({
				reason: 'Failed to fetch CSV data from remote',
				error,
			});
		},
	});

	if (!response.ok) {
		return yield* Effect.fail(new GetRemoteDataError({
			reason: `Failed to fetch CSV: ${response.status} ${response.statusText}`,
			error: new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`),
		}));
	}

	const csvText = yield* Effect.tryPromise({
		try: () => response.text(),
		catch: (error) => {			
			return new GetRemoteDataError({
				reason: 'Failed to read CSV text from response',
				error,
			});
		},
	});
	// Parse the CSV text
	const { data: quotes, errors } = Papa.parse<Quote>(csvText, {
		header: true,
		skipEmptyLines: true
	});

	if (errors.length > 0) {
		return yield* Effect.fail(new GetRemoteDataError({
			reason: `CSV parsing errors: ${errors.map(e => e.message).join(', ')}`,
			error: new Error(`CSV parsing errors: ${errors.map(e => e.message).join(', ')}`),
		}));
	}

	if (quotes.length === 0) {
		return yield* Effect.fail(new GetRemoteDataError({
			reason: 'No quotes found in CSV data',
			error: new Error('No quotes found in CSV data'),
		}));
	}

	// Return the parsed quotes
	return quotes;
});

export const getQuote = (index?: number) => Effect.gen(function* () {
	const quotesRaw = yield* Effect.tryPromise({
		try: () => AsyncStorage.getItem(STORAGE_KEY),
		catch: (error) => {			
			return new GetQuoteError({ reason: 'Failed to read quote to storage', error });
		}
	});
	if(quotesRaw === null) {return (
		yield *
		Effect.fail(new GetQuoteError({ reason: 'No quotes found in storage', error: new Error('No quotes found in storage') }))
	);} 

	const quotesJSON = yield* Schema.decodeUnknown(Schema.parseJson())(quotesRaw).pipe(Effect.catchAll((error) => {
		// eslint-disable-next-line no-console
		console.error('Error decoding quote from storage:', error);
		
		return Effect.succeed(null);
	}));
	const data = yield* Schema.decodeUnknown(Schema.Array(quoteSchema))(quotesJSON);
	const randomIndex = index ?? Math.floor(Math.random() * data.length);
	
	return { quote: data[randomIndex], randomIndex };
});

export const saveQuotes = (quote: Quote[]) => Effect.gen(function* () {
	yield* Effect.tryPromise({
		try: () => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(quote)),
		catch: (error) => {			
			return new SaveQuoteError({ reason: 'Failed to save quote to storage', error });
		}
	});
});

export const getQuotes = () => Effect.gen(function* () {
	const quotesRaw = yield* Effect.tryPromise({
		try: () => AsyncStorage.getItem(STORAGE_KEY),
		catch: (error) => {			
			return new GetQuoteError({ reason: 'Failed to read quote to storage', error });
		}
	});
	if(quotesRaw === null) {return (
		yield *
		Effect.fail(new GetQuoteError({ reason: 'No quotes found in storage', error: new Error('No quotes found in storage') }))
	);} 

	const quotesJSON = yield* Schema.decodeUnknown(Schema.parseJson())(quotesRaw).pipe(Effect.catchAll((error) => {
		// eslint-disable-next-line no-console
		console.error('Error decoding quote from storage:', error);
		
		return Effect.succeed(null);
	}));
	const data = yield* Schema.decodeUnknown(Schema.Array(quoteSchema))(quotesJSON);
	
	return data;
});

export const loadData = Effect.gen(function* () {
	const state = yield* getState.pipe(Effect.catchAll((error) => Effect.gen(function* () {
		yield* Effect.logError('Failed to get state', error);
		
		return null;
	})));
	
	const { quoteTimestamp, currentTime } = yield* getTimeData;
	
	if(state === null) {
		const version = yield* getVersionInfo;

		const data = yield* getRemoteData(getLanguage(version));

		const state = {
			index: Math.floor(Math.random() * data.length),
			date: quoteTimestamp,
			language: getLanguage(version),
			version: version.version,
			lastUpdateCheck: currentTime,
			deviceLanguage: getLocales()[0].languageTag.split('-')[0],
		};

		yield* saveQuotes(data);
		yield* setState({ ...state, date: quoteTimestamp }).pipe(Effect.catchAll((error) => Effect.logError('Failed to set state', error)));
			
		return { state }; 
	}
	
	if(yield* checkUpdata(state) || hasLanguageChanged(state)) {
		const version = yield* getVersionInfo;

		const data = yield* getRemoteData(getLanguage(version));
		yield* saveQuotes(data);
		yield* setState({ ...state, date: quoteTimestamp, version: version.version, language: getLanguage(version) }).pipe(Effect.catchAll((error) => Effect.logError('Failed to set state', error)));
	}

	if((hasLanguageChanged(state)) && (yield* renewState(state))) {
		const version = yield* getVersionInfo;

		const data = yield* getRemoteData(getLanguage(version));
		yield* saveQuotes(data);
		yield* setState({ ...state, date: quoteTimestamp, version: version.version, language: getLanguage(version) }).pipe(Effect.catchAll((error) => Effect.logError('Failed to set state', error)));
	}

	return { state };
}).pipe(Effect.catchAll((error) => {	
	return Effect.gen(function* () {
		yield* Effect.logError('Failed to load data', error);
		
		return { state: null };
	});
}));