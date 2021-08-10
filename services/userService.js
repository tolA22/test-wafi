const userModel = require('../models/user');

module.exports.create = async (user) => {
    if (!user)
        throw new Error('Missing user');

    try {
        return await userModel.create(user);
    } catch (err) {
        throw err;
    }
}


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

module.exports.transfer = async (accountNumber1, accountNumber2, amount) => {
    try {
        const withdraw = await this.withdraw(accountNumber1, amount);
        const deposit = await this.deposit(accountNumber2, amount);
        return { withdraw, deposit };
    } catch (err) {
        throw new Error('User could not transfer')
    }

}

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