import { LanguageTag } from 'public/lib/models/common/locales.model';

export const languageTags: LanguageTag[] = [
	{ isoCode: 'de-CH', short: 'de', name: 'Deutsch', id: '8fdb66f6-4bfd-47c9-a856-fbc2f19ece85' },
	{ isoCode: 'en-US', short: 'en', name: 'English', id: '2a4ce40c-a478-4ff3-945b-09966f18a909' },
	{ isoCode: 'fr-FR', short: 'fr', name: 'Français', id: 'e1b0bbeb-d38b-49c1-9b7a-83139ecc9435' },
	{ isoCode: 'es-ES', short: 'es', name: 'Espanol', id: '8ec50660-fd3e-42e2-b5eb-8dd7aa861775' },
	{ isoCode: 'it-IT', short: 'it', name: 'Italiano', id: '6fd616fa-8a78-414c-9d52-df082f11368f' },
];

export const localeToLanguageTag = new Map<string, LanguageTag>(
	languageTags.map(lang => [lang.short, lang])
);

export const langISOMap = new Map<string, LanguageTag>(
	languageTags.map(lang => [lang.isoCode, lang])
);

export const formLocalsToLocales = new Map<string, Locales[number]>([
	['Deutsch', 'de'],
	['Englisch', 'en'],
]);

export const locales = ['de', 'en', 'fr', 'es', 'it'] as const;
export const enabledLocales = ['de', 'en'] as const satisfies readonly Locales[number][];
export const defaultLocale: EnabledLocales[number] = 'en';
export const defaultLocalTag: LanguageTag = localeToLanguageTag.get(defaultLocale) as LanguageTag;

export type Locales = (typeof locales);
export type EnabledLocales = (typeof enabledLocales);