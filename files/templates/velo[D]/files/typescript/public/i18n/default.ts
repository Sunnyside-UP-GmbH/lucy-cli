import { satisfies } from 'effect/Function';
import { baseNotification, commonBase } from 'public/lib/i18n/de';
import { NotificationTranslation } from 'public/lib/models/common/translator.model';

export type AllTranslationKeys = 
	| `common:${CommonKeys}`
	| `notification:${NotificationKeys}`;
;
type CommonKeys = keyof typeof common;
type NotificationKeys = keyof typeof notification;

export type Common = { [K in keyof typeof common]: unknown }
const common = {
	...commonBase,
	mail_newsletter: {
		subject: 'Willkommen beim Newsletter',
		body: `Herzlich Willkommen beim Newsletter der Integrale Akademie Schweiz. Wir freuen uns, dass Sie sich für unseren Newsletter angemeldet haben.{{- br}}
				Sie erhalten in Kürze eine E-Mail mit einem Bestätigungslink. Bitte klicken Sie auf den Link um Ihre Anmeldung zu bestätigen. {{- br}}
				Als Dankeschön erhalten Sie einen Link zum exklusiven Download unseres Plakats "Stufen des Selbst".
			`,
		title: 'Willkommen beim Newsletter',
	},
	closed: 'Geschlossen',
	monFri: 'Mo. - Fr.',
	all: 'Alle',
	sat: 'Sa.',
	sun: 'So.',
	mon: 'Mo.',
	tue: 'Di.',
	wed: 'Mi.',
	thu: 'Do.',
	fri: 'Fr.',
	validationErrors: {
		required: 'Dieses Feld ist erforderlich!',
		email: 'Bitte geben Sie eine gültige E-Mail Adresse ein!',
		phone: 'Bitte geben Sie eine gültige Telefonnummer ein!',
		name: 'Bitte geben Sie einen gültigen Namen mit mindesten 2 Zeichen ein!',
	},
} as const;

export type Notification = { [K in keyof typeof notification]: { title: string; message: string } }
const notification = satisfies<NotificationTranslation>()({
	...baseNotification,
	shop_calender_date_reset: {
		title: 'Datum zurückgesetzt!',
		message: 'Die gewünschte Filiale ist für den {{date}} geschlossen. Bitte wählen Sie ein neues Datum aus.',
	},
	shop_added_to_cart: {
		title: 'Produkt erfolgreich zum Warenkorb hinzugefügt!',
		message: 'Viel Spass beim weiteren Einkauf!',
	},
	shop_added_to_cart_failed: {
		title: 'Das Produkt konnte nicht zum Warenkorb hinzugefügt werden!',
		message: 'Bitte versuchen Sie es später erneut.',
	},
	shop_deleted_from_cart_failed: {
		title: 'Das Produkt konnte nicht vom Warenkorb entfernt werden!',
		message: 'Bitte versuchen Sie es später erneut.',
	},
	shop_deleted_from_cart: {
		title: 'Produkt erfolgreich vom Warenkorb entfernt!',
		message: 'Viel Spass beim weiteren Einkauf!',
	},
	shop_no_product_found: {
		title: 'Kein Produkt gefunden!',
		message: 'Kein Produkt enspricht der Suche.',
	},
	shop_load_cart_error: {
		title: 'Wir konnten den Warenkorb nicht laden!',
		message: 'Bitte versuchen Sie es später erneut. <br /> {{error}}',
	},
	shop_nothing_to_add: {
		title: 'Wir konnten kein Produkt hinzufügen!',
		message: 'Bitte versuchen Sie es später erneut.',
	},
	shop_payment_error: {
		title: 'Zahlung fehlgeschlagen!',
		message: 'Wir konnten den Bezahlvorgang nicht abschliessen. Bitte versuchen Sie es später erneut. <br /> <b>Status:</b> {{status}}',
	},
	shop_order_creation_error: {
		title: 'Wir konnten die Bestellung nicht abschliessen!',
		message: 'Die Zahlung ist eingegangen, aber wir konnten die Bestellung nicht abschliessen. Bitte kontaktieren Sie uns.<br /> <strong>Transatkions ID</strong>: {{transactionId}} <br /> <strong>Warenkorb ID</strong>: {{cartId}} <br /> <strong>Fehler: </strong>{{error}}',
	},
	shop_terms_not_accepted: {
		title: 'Sie müssen die AGB akzeptieren!',
		message: 'Bitte akzeptieren Sie die AGB um fortzufahren.',
	},
	shop_no_checkout: {
		title: 'Wir konnten keine Bestellung finden!',
		message: 'Bitte versuchen Sie es später erneut.',
	},
	shop_no_propper_address: {
		title: 'Keine Filiale ausgewählt!',
		message: 'Es wurde keine Filiale ausgewählt. Bitte wählen Sie eine <a href="/store-and-date-picker">Filiale</a> aus.',
	},
	date_not_available: {
		title: 'Das ausgewählte Abholdatum ist nicht gültig!',
		message: 'Das ausgewählte Abholdatum {{date}} ist nicht gültig. Bitte wählen Sie ein anderes Datum aus.',
	},
	cart_validation_error: {
		title: 'Ungültige Angaben!',
		message: 'Die Angaben für {{article}} sind ungültig. Bitte überprüfen Sie Ihre Angaben.',
	},
	cart_min_order_value: {
		title: 'Mindestbestellwert nicht erreicht!',
		message: 'Der Mindestbestellwert von {{minOrderValue}}.00 CHF wurde nicht erreicht.',
	},
	shop_cart_invalid: {
		title: 'Der Warekorb ist ungültig!',
		message: 'Bitte versuchen Sie es später erneut.',
	},
	shop_validation_error: {
		title: 'Der Warenkorb enthält ungültige Produkte!',
		message: '<b>{{article}} ist ungültig</b><br>- {{- validationErrors}}',
	},
	shop_payment_failed: {
		title: 'Weiterleitung zum Warenkorb',
		message: 'Sie werden in 2 Minuten zum Warenkorb weitergeleitet. <a href="/warenkorb">Zum Warenkorb</a>',
	}
} as const);

export { common, notification };
export default { common, notification };