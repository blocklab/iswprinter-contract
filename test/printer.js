var Printer = artifacts.require('./Printer.sol')

contract('Printer', accounts => {

  const ALICE = accounts[0]
  const G_CODE_HASH = '0x2ed2247fa129d3b73c811ea914c15bf8b21d8cb3a6f9da48042e0ffa1da94430'

  it('exists', () => {
    return Printer.deployed().then(instance => {
      assert.ok(instance !== undefined)
    })
  })

  it('allows user who never paid to print zero times', () => {
    return Printer.deployed().then(instance => {
      return instance.timesUserIsAllowedToPrint.call(G_CODE_HASH, ALICE)
    }).then(times => {
      assert.equal(times, 0)
    })
  })

  it('allows user paying once to print once', () => {
    return Printer.deployed().then(instance => {
      return instance.buyRightToPrintOnce(G_CODE_HASH, {
        from: ALICE,
        value: 10000
      }).then(() => {
        return instance.timesUserIsAllowedToPrint.call(G_CODE_HASH, ALICE)
      }).then(times => {
        assert.equal(times, 1)
      })
    })
  })
})
