const utilities = require("../services/utilities");

describe("testing the utilities file", () => {
  it("usdEquivalent - should return 1 for usd", () => {
    const usdCheck = utilities.usdEquivalent("usd", 1);
    const expectedValue = 1;

    expect(usdCheck).toBe(expectedValue);
  });

  it("usdEquivalent - should return 411.57 for naira", () => {
    const nairaCheck = utilities.usdEquivalent("naira", 411.57);
    const expectedValue = 1;

    expect(nairaCheck).toBe(expectedValue);
  });

  it("currencyEquivalent - should return the right usd amount", () => {
    const usdCheck = utilities.currencyEquivalent("usd", 20);
    const expectedValue = 20;

    expect(usdCheck).toBe(expectedValue);
  });

  it("currencyEquivalent - should return the right naira amount", () => {
    const nairaCheck = utilities.currencyEquivalent("naira", 20);
    const expectedValue = 20 * 411.57;

    expect(nairaCheck).toBe(expectedValue);
  });
});
