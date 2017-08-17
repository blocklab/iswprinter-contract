pragma solidity ^0.4.11;

contract Printer {
  mapping (bytes32 => Printable) printables;

  struct Printable {
    mapping(address => uint) timesUserIsAllowedToPrint;
  }

  function buyRightToPrintOnce(bytes32 gCodeHash) payable {
    require (msg.value >= 10000);
    printables[gCodeHash].timesUserIsAllowedToPrint[msg.sender] = 1;
  }

  function timesUserIsAllowedToPrint(bytes32 gCodeHash, address user) constant returns (uint) {
    return printables[gCodeHash].timesUserIsAllowedToPrint[user];
  }
}
