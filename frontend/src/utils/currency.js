export const SUPPORTED_CURRENCIES = [
	{ code: 'USD', symbol: '$', name: 'US Dollar' },
	{ code: 'EUR', symbol: '€', name: 'Euro' },
	{ code: 'GBP', symbol: '£', name: 'British Pound' },
	{ code: 'INR', symbol: '₹', name: 'Indian Rupee' },
	{ code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
	{ code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
	{ code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
	{ code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
	{ code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
	{ code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
	{ code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
	{ code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
]

export const DEFAULT_CURRENCY = 'USD'

const CURRENCY_MAP = new Map(SUPPORTED_CURRENCIES.map((currency) => [currency.code, currency]))

export const getCurrencyMeta = (currencyCode = DEFAULT_CURRENCY) => {
	return CURRENCY_MAP.get(currencyCode) || CURRENCY_MAP.get(DEFAULT_CURRENCY)
}

export const getCurrencySymbol = (currencyCode = DEFAULT_CURRENCY) => {
	return getCurrencyMeta(currencyCode).symbol
}