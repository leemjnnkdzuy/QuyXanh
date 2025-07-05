export const createCurrencyFormatter = (t) => {
	return (amount) => {
		if (amount >= 1000000000) {
			const billions = Math.floor(amount / 1000000000);
			const remainder = amount % 1000000000;

			if (remainder >= 100000000) {
				const hundreds = Math.floor(remainder / 100000000);
				return `${billions}.${hundreds}${t("currency.billion")}`;
			}
			return `${billions}${t("currency.billion")}`;
		} else if (amount >= 1000000) {
			const millions = Math.floor(amount / 1000000);
			return `${millions}${t("currency.million")}`;
		} else if (amount >= 1000) {
			const thousands = Math.floor(amount / 1000);
			return `${thousands}${t("currency.thousand")}`;
		}
		return amount.toString();
	};
};
