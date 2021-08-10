const mongoose = require('mongoose');

const dbHandler = require('./db-handler');
const userService = require('../services/userService');

jest.setTimeout(20000 * 1000)


// Setup connection to the database
beforeAll(async () => await dbHandler.connect());
beforeEach(async () => await dbHandler.clear());
afterEach(async () => await dbHandler.clear());
afterAll(async () => await dbHandler.close());

const userA = {
    firstName: 'User',
    lastName: 'A',
    email: 'userA@email.com',
    accountNumber: Math.floor(Math.random() * Date.now())
}

const userB = {
    firstName: 'User',
    lastName: 'B',
    email: 'userB@email.com',
    accountNumber: Math.floor(Math.random() * Date.now())
}
/**
 * User test suite
 */
describe('user ', () => {


    /**
     * Tests that a valid user can be created through the userService without throwing any errors.
     */
    it('can be created correctly', async () => {

        expect(async () => await userService.create(userA))
            .not
            .toThrow();

    });

    /**
     * Tests that a valid user can be created through the userService with account balance defaulted to 0.
     */
    it('can be created correctly and account balance is set to 0', async () => {
        const modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0)

    });



    /**
     * Tests that a valid user can be created through the userService and deposit into the account.
     */
    it('can deposit correctly', async () => {
        let modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0);

        let value = 20
        let expected = 20

        //deposit value to the balance and expect it to be expected
        modelUserA = await userService.deposit(modelUserA.accountNumber, value)
        expect(modelUserA.balance).toBe(expected);

        value = 23
        expected += value
        //deposit 23 to the balance and expect it to be 43
        modelUserA = await userService.deposit(modelUserA.accountNumber, value)
        expect(modelUserA.balance).toBe(expected);
    })


    /**
     * Tests for invalid deposits value
     */
    it('catches error for invalid deposit value', async () => {
        const modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0)

        const value = 'a'
        expect(async () => await userService.deposit(userA.accountNumber, value)).rejects.toEqual(new Error('User could not deposit'))

    });

    /**
     * Tests for invalid withdraw value
     */
    it('catches error for invalid withdraw value', async () => {
        const modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0)

        const value = 'a'
        expect(async () => await userService.withdraw(modelUserA.accountNumber, value)).rejects.toEqual(new Error('User could not withdraw'))

    });

    /**
     * Tests for invalid withdraw value
     */
    it('catches error for invalid withdraw value when value is less than account balance', async () => {
        const modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0)

        const value = 10
        expect(async () => await userService.withdraw(modelUserA.accountNumber, value)).rejects.toEqual(new Error('User could not withdraw'))

    });



    /**
     * Tests that a valid user can be created through the userService and withdraw from the account.
     */
    it('can withdraw correctly', async () => {
        let modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0);

        let depositValue = 20
        let depositExpected = 20

        //deposit value to the balance and expect it to be expected
        modelUserA = await userService.deposit(modelUserA.accountNumber, depositValue)
        expect(modelUserA.balance).toBe(depositExpected);

        let withdrawValue = 13;
        let withdrawExpected = 7;
        //withdraw value from the balance
        modelUserA = await userService.withdraw(modelUserA.accountNumber, withdrawValue)
        expect(modelUserA.balance).toBe(withdrawExpected);

    });

    /**
     * Tests that a valid user can be created through the userService and can transfer from the account to another valid account.
     */

    it('should transfer money between two users correctly', async () => {
        //create user a 
        let modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0);

        //create user b
        let modelUserB = await userService.create(userB);
        expect(modelUserB.balance).toBe(0);

        const depositValue = 20
        const depositExpected = 20

        //deposit value to the balance and expect it to be expected
        modelUserA = await userService.deposit(modelUserA.accountNumber, depositValue)
        expect(modelUserA.balance).toBe(depositExpected);

        const transferValue = 12;
        const expectedBalanceB = 12;
        const expectedBalanceA = depositExpected - transferValue;
        //transfer from user a to user b
        const { withdraw: currentModelUserA, deposit: currentModelUserB } = await userService.transfer(modelUserA.accountNumber, modelUserB.accountNumber, transferValue)

        expect(currentModelUserB.balance).toBe(expectedBalanceB);
        expect(currentModelUserA.balance).toBe(expectedBalanceA);


    });

    /**
     * Tests that a valid user can be created through the userService and can check account balance (account details)
     */

    it('should fetch account details correctly', async () => {
        //create user a 
        let modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0);

        const depositValue = 20
        const depositExpected = 20

        //deposit value to the balance and expect it to be expected
        modelUserA = await userService.deposit(modelUserA.accountNumber, depositValue)
        expect(modelUserA.balance).toBe(depositExpected);

        //check balance
        modelUserA = await userService.check(modelUserA.accountNumber);
        expect(modelUserA.balance).toBe(depositExpected);

    });


});

describe('sample test', () => {
    it('testing the example', async () => {
        //userA is added to the app
        let modelUserA = await userService.create(userA);
        expect(modelUserA.balance).toBe(0);

        //userA deposits 10 dollars
        const dollar10 = 10
        modelUserA = await userService.deposit(modelUserA.accountNumber, dollar10);
        expect(modelUserA.balance).toBe(dollar10);

        //userB is added to the app
        let modelUserB = await userService.create(userB);
        expect(modelUserB.balance).toBe(0);

        //userB deposits 20 dollars
        const dollar20 = 20;
        modelUserB = await userService.deposit(modelUserB.accountNumber, dollar20);
        expect(modelUserB.balance).toBe(dollar20);

        //user B sends 15 dollars to user A
        const dollar15 = 15;
        const { withdraw: currentModelUserB, deposit: currentModelUserA } = await userService.transfer(modelUserB.accountNumber, modelUserA.accountNumber, dollar15)


        // user A checks their balance and has 25 dollars
        const dollar25 = 25
        modelUserA = await userService.check(currentModelUserA.accountNumber);
        expect(modelUserA.balance).toBe(dollar25);

        //user B checks their balance and has 5 dollars
        const dollar5 = 5
        modelUserB = await userService.check(modelUserB.accountNumber);
        expect(modelUserB.balance).toBe(dollar5)

        //userA withdraws 25dollars from their account
        modelUserA = await userService.withdraw(modelUserA.accountNumber, dollar25)

        //user A checks their balance and has 0 dollars
        const dollar0 = 0
        modelUserA = await userService.check(modelUserA.accountNumber);
        expect(modelUserA.balance).toBe(dollar0)



    })
})
