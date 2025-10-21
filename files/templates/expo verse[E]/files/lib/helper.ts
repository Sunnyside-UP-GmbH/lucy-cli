import { DateTime, Effect } from 'effect';
import { getLocales } from 'expo-localization';

import { DataState, Version } from '@/models';

import { FALLBACK_LOCALE } from '../constants/config';


export const getTimeData = Effect.gen(function* () {
	const currentTime = yield* DateTime.now;
	const quoteTimestamp = DateTime.setParts(currentTime, { hours: 4, minutes: 30, seconds: 0 });
	
	return { quoteTimestamp, currentTime };
});
/**
 * Get the language to use for the quote.
 * @param version The version of the app.
 * @returns The language to use for the quote.
 */
export function getLanguage(version: Version) {
	const locale = getLocales()[0].languageTag.split('-')[0];
	if(version.languages.includes(locale)) return locale.toLowerCase();
	
	return FALLBACK_LOCALE.toLowerCase();
};

/**
 * Check if the language has changed.
 * @param state The state of the app.
 * @returns Whether the language has changed.
 */
export function hasLanguageChanged(state: DataState) {
	const locale = getLocales()[0].languageTag.split('-')[0];
	
	return state.deviceLanguage.toLowerCase() !== locale.toLowerCase();
}
export const renewState = (state: DataState) => Effect.gen(function* () {
	// if(__DEV__) return true;
	
	const { currentTime } = yield* getTimeData;
	const elapsed = DateTime.distance(state.date, currentTime);
	if (elapsed >= 86400000) return true;
	
	return false;
});
export const checkUpdata = (state: DataState) => Effect.gen(function* () {
	// if(__DEV__) return true;

	const { currentTime } = yield* getTimeData;
	const elapsed = DateTime.distance(state.lastUpdateCheck, currentTime);
	if (elapsed >= 86400000) return true;
	
	return false;
});