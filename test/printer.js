var Printer = artifacts.require('./Printer.sol')

contract('Printer', accounts => {

  const OSCAR_THE_OWNER = accounts[0]
  const BOB_THE_USER = accounts[1]
  const PETE_THE_PRINTER = accounts[2]
  const G_CODE_HASH = '0x2ed2247fa129d3b73c811ea914c15bf8b21d8cb3a6f9da48042e0ffa1da94430'

  it('allows user who never paid to print zero times', () => {
    return Printer.deployed().then(instance => {
      return instance.timesUserIsAllowedToPrint.call(G_CODE_HASH, BOB_THE_USER)
    }).then(timesUserCanPrint => {
      assert.equal(timesUserCanPrint, 0)
    })
  })

  it('allows user paying once to print once', () => {
    return Printer.deployed().then(instance => {
      return instance.buyRightToPrintOnce(G_CODE_HASH, {
        from: BOB_THE_USER,
        value: 10000
      }).then(() => {
        return instance.timesUserIsAllowedToPrint.call(G_CODE_HASH, BOB_THE_USER)
      }).then(timesUserCanPrint => {
        assert.equal(timesUserCanPrint, 1)
      })
    })
  })

  it('allows the owner to reset the allowed prints back to zero', () => {
    return Printer.deployed().then(instance => {
      return instance.buyRightToPrintOnce(G_CODE_HASH, {
        from: PETE_THE_PRINTER,
        value: 10000
      }).then(() => {
        return instance.resetPrints(G_CODE_HASH, PETE_THE_PRINTER, {
          from: OSCAR_THE_OWNER
        })
      }).then(() => {
        return instance.timesUserIsAllowedToPrint.call(G_CODE_HASH, PETE_THE_PRINTER)
      }).then(timesUserCanPrint => {
        assert.equal(timesUserCanPrint, 0)
      })
    })
  })
})
