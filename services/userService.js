const userModel = require("../models/user");
const utilities = require("./utilities");
/**
 *
 * @param {*} user the user model to be created
 * @returns the newly created user model or throws error
 */
module.exports.create = async (user) => {
  if (!user) throw new Error("Missing user");

  try {
    return await userModel.create(user);
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {*} accountNumber the account number of the account to be deposited
 * @param {*} amount the amount to be added to the account
 * @param {*} currency the currency of the transaction
 * @returns the user model or throws error
 */
module.exports.deposit = async (accountNumber, amount, currency = "USD") => {
  const query = { accountNumber };

  try {
    let user = await userModel.findOne(query);
    if (!user) throw new Error("User not found");

    const equivalentAmount = utilities.usdEquivalent(currency, amount);
    user.balance = user.balance + equivalentAmount;
    await user.save();
    return user;
  } catch (err) {
    throw new Error("User could not deposit");
  }
};

/**
 *
 * @param {*} accountNumber the account number of the account to withdraw from
 * @param {*} amount the amount to be withdrawn
 * @param {*} currency the currency of the transaction
 * @returns returns the user model or throws error
 */
module.exports.withdraw = async (accountNumber, amount, currency = "USD") => {
  const query = { accountNumber };

  try {
    let user = await userModel.findOne(query);
    if (!user) throw new Error("User not found");

    const equivalentAmount = utilities.usdEquivalent(currency, amount);
    const balance = user.balance - equivalentAmount;
    if (balance < 0) throw new Error("Insufficient funds");

    user.balance = balance;
    await user.save();
    return user;
  } catch (err) {
    throw new Error("User could not withdraw");
  }
};

/**
 *
 * @param {*} accountNumber1 the account number to be transferred from
 * @param {*} accountNumber2 the account number to transfer to
 * @param {*} amount the amount to be transferred
 * @param {*} currency the currency of the transaction
 * @returns  the user model or throws error
 */
module.exports.transfer = async (
  accountNumber1,
  accountNumber2,
  amount,
  currency = "USD"
) => {
  try {
    const withdraw = await this.withdraw(accountNumber1, amount, currency);
    const deposit = await this.deposit(accountNumber2, amount, currency);
    return { withdraw, deposit };
  } catch (err) {
    throw new Error("User could not transfer");
  }
};
/**
 *
 * @param {*} accountNumber the account number to be checked
 * @returns the user model or throws error
 */
module.exports.check = async (accountNumber) => {
  const query = { accountNumber };
  try {
    const user = await userModel.findOne(query);

    if (!user) throw new Error("User not found");
    return user;
  } catch (err) {
    throw new Error("User not found");
  }
};

/**
 *
 * @param {*} accountNumber the account number to be checked
 * @param {*} currency the currency of the transaction
 * @returns currencyEquivalent of the current balance
 */
module.exports.checkViaCurrency = async (accountNumber, currency = "USD") => {
  const query = { accountNumber };
  try {
    const user = await userModel.findOne(query);

    if (!user) throw new Error("User not found");

    const equivalentBalance = utilities.currencyEquivalent(
      currency,
      user.balance
    );
    return equivalentBalance;
  } catch (err) {
    throw err;
  }
};
