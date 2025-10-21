import { Data, DateTime, Effect, pipe, Schedule, Schema } from 'effect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { getLocales } from 'expo-localization';
import Papa from 'papaparse';

export class StorageError extends Data.TaggedError('StorageError')<{reason: string}> {}
export class QuoteNotFoundError extends Data.TaggedError('QuoteNotFoundError')<{reason: string}> {}
export class DataError extends Data.TaggedError('DataError')<{reason: string}> {}

const assets = {
    en: require('@/assets/data/en.csv'),
	de: require('@/assets/data/de.csv'),
};

const supportedLocales = Object.keys(assets);
const fallbackLocale: keyof typeof assets = 'en';
const fallbackQuote: Quote = { source: 'The Lord', content: 'The ways of the Lord are inscrutable.' };
const storage_key = 'dailySpiritQuote';

const schema = Schema.parseJson()
const decode = Schema.decodeUnknown(schema)

const dataSchema = Schema.Struct({
    source: Schema.String,
    content: Schema.String,
    _id: Schema.String,
    _owner: Schema.String,
    _createdDate: Schema.Any,
    _updatedDate: Schema.Any,
});

const storageSchema = Schema.Struct({
    index: Schema.Number,
    date: Schema.DateTimeUtc,
})
type StorageSchema = typeof storageSchema.Type;

type Quote = {
    source: string;
    content: string;
}

// Type guard to check if a string is a valid locale key
function isSupportedLocale(locale: string): locale is keyof typeof assets {
    return supportedLocales.includes(locale);
}

const clearStorage = Effect.gen(function* () {
    yield* Effect.tryPromise({
        try: () => AsyncStorage.removeItem(storage_key),
        catch: (error) => {
            console.error('Error clearing storage:', error);
            return new StorageError({ reason: 'Failed to clear storage' });
        }
    });
});

const saveToStorage = (quote: StorageSchema) => Effect.gen(function* () {
    yield* Effect.tryPromise({
		try: () => AsyncStorage.setItem(storage_key, JSON.stringify(quote)),
        catch: (error) => {
            console.error('Error saving quote to storage:', error);
            return new StorageError({ reason: 'Failed to save quote to storage' });
        }
    });
});

const getFromStorage = Effect.gen(function* () {
	const quoteRaw = yield* Effect.tryPromise({
        try: () => AsyncStorage.getItem(storage_key),
        catch: (error) => {
            console.error('Error fetching quote from storage:', error);
            AsyncStorage.removeItem(storage_key)
            return new StorageError({ reason: 'Failed to fetch quote from storage' });
        }
    }).pipe(Effect.catchAll((error) => {
		console.error('Error fetching quote from storage:', error);
		return Effect.succeed(null);
	}));
	
	const QuoteJSON = yield* Schema.decodeUnknown(Schema.parseJson())(quoteRaw).pipe(Effect.catchAll((error) => {
		console.error('Error decoding quote from storage:', error);
		return Effect.succeed(null);
	}));
	const data = yield* Schema.decodeUnknown(storageSchema)(QuoteJSON).pipe(
			Effect.catchAll((error) => {
				console.error('Failed to decode quote from storage:', error);
				return Effect.gen(function* () {
					yield* clearStorage.pipe(Effect.catchAll((error) => {
						console.error('Error clearing storage:', error);
						return Effect.succeed(null);
					}));
					return yield* Effect.succeed(null);
				})
			}
		)
	);
	return data;
});

const getQuoteFromCSV = (index?: number) => Effect.gen(function* () {
    const locale = getLocales()[0].languageTag.split('-')[0];
    const asset = isSupportedLocale(locale) ? assets[locale] : assets[fallbackLocale];
    
    const [{ localUri }] = yield* Effect.tryPromise({
        try: () => Asset.loadAsync(asset),
        catch: (error) => {
            console.error('Error loading asset:', error);
            return new DataError({ reason: 'Failed to load asset' });
        }
    })
    const csv = yield* Effect.tryPromise({
        try: () => FileSystem.readAsStringAsync(localUri || ''),
        catch: (error) => {
            console.error('Error loading asset:', error);
            return new DataError({ reason: 'Failed to read CSV file' });
        }
    })
    
    const { data: quotes, errors } = Papa.parse<{Verse: string, Reference: string, Topic: string}>(csv, { header: true, skipEmptyLines: true });
    if (errors.length > 0) {
        console.error('Error parsing CSV:', errors);
        return yield* Effect.succeed(null);
    }

    if (quotes.length === 0) {
        return yield* Effect.succeed(null);
    }
    
	if(index !== undefined) {
		if(index <= quotes.length) {
			const randomQuote = quotes[index];
			return { source: randomQuote.Reference, content: randomQuote.Verse, index: index };
		}
		if(index < 0 || index <= quotes.length) {
			yield* clearStorage
			return yield* Effect.succeed(null);
		}
	}

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

	return { source: randomQuote.Reference, content: randomQuote.Verse, index: randomIndex };
})

export const getData = () => Effect.gen(function* () {
    const currentTime = yield* DateTime.now;
    const quoteTimestamp = DateTime.setParts(currentTime, {hours: 4, minutes: 30, seconds: 0});
    const dataFromStorage = yield* getFromStorage

	if(dataFromStorage !== null) {
		const elapsed = DateTime.distance(dataFromStorage.date, currentTime);
		if (elapsed <= 86400000) {
			const quoteWithIndex = yield* getQuoteFromCSV(dataFromStorage.index);
			if (quoteWithIndex !== null) {
				const quoteDate: Quote = { source: quoteWithIndex.source, content: quoteWithIndex.content };
				return quoteDate;
			}
		} 
	}

	const quoteWithIndex = yield* getQuoteFromCSV();
	if (quoteWithIndex === null) {
		console.warn('No quote found, returning fallback quote');
		return yield* Effect.fail(new QuoteNotFoundError({ reason: 'No quote found' }));
	}
	
	const quoteDate: Quote = { source: quoteWithIndex.source, content: quoteWithIndex.content };
	yield* saveToStorage({
		index: quoteWithIndex.index,
		date: quoteTimestamp,
	})

	return quoteDate;
}).pipe(Effect.catchTags({
	QuoteNotFoundError: (error) => {
		console.warn('Quote not found in storage, returning fallback quote');
		return Effect.succeed(fallbackQuote);
	},
	DataError: (error) => {
		console.error('Data error occurred:', error);
		return Effect.succeed(fallbackQuote);
	},
	StorageError: (error) => {
		console.error('Storage error occurred:', error);
		return Effect.gen(function* () {
			yield* clearStorage.pipe(Effect.catchAll((error) => {
				console.error('Error clearing storage:', error);
				return Effect.succeed(null);
			}));
			return yield* Effect.succeed(fallbackQuote);
		})
	}
}))