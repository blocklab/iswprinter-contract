var Printer = artifacts.require("./Printer.sol");

contract('Printer', accounts => {
  it('exists', () => {
    return Printer.deployed().then(instance => {
      assert.ok(instance !== undefined)
    })
  })
});
