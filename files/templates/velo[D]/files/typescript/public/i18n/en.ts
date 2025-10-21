import { satisfies } from 'effect/Function';
import { baseNotification, commonBase, } from 'public/lib/i18n/en';
import { NotificationTranslation } from 'public/lib/models/common/translator.model';

import { Common, Notification } from './default';

const common: Common = {
	...commonBase,
	mail_newsletter: {
		subject: 'Welcome to the Newsletter',
		body: `Welcome to the newsletter of the Integral Academy Switzerland. We are delighted that you have signed up for our newsletter.{{- br}}
				You will soon receive an email with a confirmation link. Please click on the link to confirm your subscription.{{- br}}
				As a thank you, you will receive a link to the exclusive download of our poster "Stages of the Self".
			`,
		title: 'Welcome to the Newsletter',
	},
	closed: 'Closed',
	monFri: 'Mon. - Fri.',
	all: 'All',
	sat: 'Sat.',
	sun: 'Sun.',
	mon: 'Mon.',
	tue: 'Tue.',
	wed: 'Wed.',
	thu: 'Thu.',
	fri: 'Fri.',
	validationErrors: {
		required: 'This field is required!',
		email: 'Please enter a valid email address!',
		phone: 'Please enter a valid phone number!',
		name: 'Please enter a valid name with at least 2 characters!',
	},
};

// const notification: NotificationTranslationSchema = {
const notification: Notification = satisfies<NotificationTranslation>()({
	...baseNotification,
	shop_calender_date_reset: {
		title: 'Date reset!',
		message: 'The selected store is closed for {{date}}. Please choose a new date.',
	},
	shop_added_to_cart: {
		title: 'Product successfully added to the cart!',
		message: 'Enjoy your further shopping!',
	},
	shop_added_to_cart_failed: {
		title: 'Product could not be added to the cart!',
		message: 'Please try again later.',
	},
	shop_deleted_from_cart_failed: {
		title: 'Product could not be removed from the cart!',
		message: 'Please try again later.',
	},
	shop_deleted_from_cart: {
		title: 'Product successfully removed from the cart!',
		message: 'Enjoy your further shopping!',
	},
	shop_no_product_found: {
		title: 'No product found!',
		message: 'No product matches your search.',
	},
	shop_load_cart_error: {
		title: "We couldn't load your cart!",
		message: 'Please try again later. <br /> {{error}}',
	},
	shop_nothing_to_add: {
		title: "We couldn't add any product!",
		message: 'Please try again later.',
	},
	shop_payment_error: {
		title: 'Payment failed!',
		message: "We couldn't complete the payment process. Please try again later. <br /> <b>Status:</b> {{status}}",
	},
	shop_order_creation_error: {
		title: "We couldn't complete the order!",
		message: "The payment has been received, but we couldn't complete the order. Please contact us.<br /> <strong>Transaction ID</strong>: {{transactionId}} <br /> <strong>Cart ID</strong>: {{cartId}} <br /> <strong>Error: </strong>{{error}}",
	},
	shop_terms_not_accepted: {
		title: 'You must accept the terms and conditions!',
		message: 'Please accept the terms and conditions to continue.',
	},
	shop_no_checkout: {
		title: "We couldn't find any order!",
		message: 'Please try again later.',
	},
	shop_no_propper_address: {
		title: 'No store selected!',
		message: 'No store has been selected. Please choose a <a href="/store-and-date-picker">store</a>.',
	},
	date_not_available: {
		title: 'The selected pickup date is not valid!',
		message: 'The selected pickup date {{date}} is not valid. Please choose another date.',
	},
	cart_validation_error: {
		title: 'Invalid product details!',
		message: 'Product details for {{article}} are invalid.',
	},
	cart_min_order_value: {
		title: 'Minimal order value not reached!',
		message: 'The minimal order value is {{minOrderValue}}.00 CHF.',
	},
	shop_cart_invalid: {
		title: 'The cart is invalid!',
		message: 'Please try again later.',
	},
	shop_validation_error: {
		title: 'The cart contains invalid products!',
		message: '<b>{{article}} is invalid:</b><br />- {{- validationErrors}}',
	},
	shop_payment_failed: {
		title: 'Redirecting to the shopping cart!',
		message: 'In 2 minutes you will be redirected to the shopping cart. <a href="/warenkorb">Go to the shopping cart</a>',
	}
} as const);

export { common, notification };
export default { common, notification };