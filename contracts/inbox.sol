// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Inbox{
    string public message;

    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    function setMessage (string memory newMessage) public {
        message = newMessage;
    }

    // Already generated by the above message variable 
    // function getMessage () public view returns (string memory) {
    //     return message;
    // }
}