const userModel = require('../models/user');

/**
 * 
 * @param {*} user the user model to be created
 * @returns the newly created user model or throws error
 */
module.exports.create = async (user) => {
    if (!user)
        throw new Error('Missing user');

    try {
        return await userModel.create(user);
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @param {*} accountNumber the account number of the account to be deposited
 * @param {*} amount the amount to be added to the account
 * @returns the user model or throws error
 */
module.exports.deposit = async (accountNumber, amount) => {
    const query = { accountNumber }

    try {
        let user = await userModel.findOne(query);
        if (!user)
            throw new Error('User not found');

        user.balance = user.balance + amount;
        await user.save();
        return user;
    } catch (err) {
        throw new Error('User could not deposit');
    }
}

/**
 * 
 * @param {*} accountNumber the account number of the account to withdraw from
 * @param {*} amount the amount to be withdrawn
 * @returns returns the user model or throws error
 */
module.exports.withdraw = async (accountNumber, amount) => {
    const query = { accountNumber }

    try {
        let user = await userModel.findOne(query);
        if (!user)
            throw new Error('User not found');

        const balance = user.balance - amount;
        if (balance < 0)
            throw new Error('Insufficient funds')

        user.balance = balance;
        await user.save();
        return user;
    } catch (err) {
        throw new Error('User could not withdraw');
    }
}

/**
 * 
 * @param {*} accountNumber1 the account number to be transferred from
 * @param {*} accountNumber2 the account number to transfer to
 * @param {*} amount the amount to be transferred
 * @returns  the user model or throws error
 */
module.exports.transfer = async (accountNumber1, accountNumber2, amount) => {
    try {
        const withdraw = await this.withdraw(accountNumber1, amount);
        const deposit = await this.deposit(accountNumber2, amount);
        return { withdraw, deposit };
    } catch (err) {
        throw new Error('User could not transfer')
    }

}
/**
 * 
 * @param {*} accountNumber the account number to be checked
 * @returns the user model or throws error
 */
module.exports.check = async (accountNumber) => {
    const query = { accountNumber }
    try {
        const user = await userModel.findOne(query);

        if (!user)
            throw new Error('User not found');
        return user;
    } catch (err) {
        throw new Error('User not found')
    }
}