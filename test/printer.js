const Printer = artifacts.require('./Printer.sol')

let assertException = error => {
  if (error.toString().indexOf("invalid opcode") == -1) {
    assert(false, error.toString());
  }
}

contract('Printer', accounts => {

  const OSCAR_THE_OWNER = accounts[0]
  const BOB_THE_USER = accounts[1]
  const PETE_THE_PRINTER = accounts[2]
  const G_CODE_HASH = '0x2ed2247fa129d3b73c811ea914c15bf8b21d8cb3a6f9da48042e0ffa1da94430'
  const PRINT_COST = 10000

  it('allows user who never paid to print zero times', async () => {
    const printer = await Printer.deployed()
    const timesUserCanPrint =
      await printer.timesUserIsAllowedToPrint.call(G_CODE_HASH, BOB_THE_USER)

    assert.equal(timesUserCanPrint, 0)
  })

  it('costs ' + PRINT_COST + ' wei to print once', async () => {
    const printer = await Printer.deployed()
    try {
      await printer.buyRightToPrintOnce(G_CODE_HASH, {
        from: PETE_THE_PRINTER,
        value: PRINT_COST - 1
      })
      assert.fail("buyRightToPrintOnce() was supposed to throw but did not");
    } catch (error) {
      assertException(error)
    }
  })

  it('allows user paying once to print once', async () => {
    const printer = await Printer.deployed()

    await printer.buyRightToPrintOnce(G_CODE_HASH, {
      from: BOB_THE_USER,
      value: PRINT_COST
    })

    const timesUserCanPrint =
      await printer.timesUserIsAllowedToPrint.call(G_CODE_HASH, BOB_THE_USER)
    assert.equal(timesUserCanPrint, 1)
  })

  it('allows the owner to reset the allowed prints back to zero', async () => {
    const printer = await Printer.deployed()
    await printer.buyRightToPrintOnce(G_CODE_HASH, {
      from: PETE_THE_PRINTER,
      value: PRINT_COST
    })

    await printer.resetPrints(G_CODE_HASH, PETE_THE_PRINTER, {
      from: OSCAR_THE_OWNER
    })

    const timesUserCanPrint =
      await printer.timesUserIsAllowedToPrint.call(G_CODE_HASH, PETE_THE_PRINTER)
    assert.equal(timesUserCanPrint, 0)
  })
})
