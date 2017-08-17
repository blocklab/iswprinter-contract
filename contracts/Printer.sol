pragma solidity ^0.4.11;

contract Printer {
  mapping (bytes32 => Printable) printables;
  address public owner;

  struct Printable {
    mapping(address => uint) timesUserIsAllowedToPrint;
  }

  modifier onlyByOwner() {
    require(msg.sender == owner);
    _;
  }

  function Printer() {
    owner = tx.origin;
  }

  function buyRightToPrintOnce(bytes32 gCodeHash) payable {
    require (msg.value >= 10000);
    printables[gCodeHash].timesUserIsAllowedToPrint[msg.sender] = 1;
  }

  function resetPrints(bytes32 gCodeHash, address user) onlyByOwner {
    printables[gCodeHash].timesUserIsAllowedToPrint[user] = 0;
  }

  function timesUserIsAllowedToPrint(bytes32 gCodeHash, address user) constant returns (uint) {
    return printables[gCodeHash].timesUserIsAllowedToPrint[user];
  }
}
