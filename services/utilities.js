module.exports.usdEquivalent = (currency, amount) => {
  if (!currency) throw new Error("Currency required");
  const exchangeRates = {
    usd: 1,
    naira: 411.57,
    yen: 109.47,
    yuan: 6.46,
  };

  // get the current exchange rate value;
  const currentExchangeValue = exchangeRates[currency.toLowerCase()];
  if (!currentExchangeValue) throw new Error("Currency does not exist");

  return amount / currentExchangeValue;
};

module.exports.currencyEquivalent = (currency, amount) => {
  if (!currency) throw new Error("Currency required");
  const exchangeRates = {
    usd: 1,
    naira: 411.57,
    yen: 109.47,
    yuan: 6.46,
  };

  // get the current exchange rate value;
  const currentExchangeValue = exchangeRates[currency.toLowerCase()];

  if (!currentExchangeValue) throw new Error("Currency does not exist");

  return amount * currentExchangeValue;
};
