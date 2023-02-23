// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

interface IVerifier {
    function verify(bytes calldata) external view returns (bool);
}

contract PrivateTransfer is ReentrancyGuard {
    // amount deposited for each commitment
    uint256 public amount;
    bytes32 public root;

    // a nullifier is necessary to prevent someone from performing the same withdrawal twice
    mapping(bytes32 => bool) public nullifierHashes;
    // we store all commitments just to prevent accidental deposits with the same commitment
    mapping(uint256 => bool) public commitments;
    // uint256[] public commitments;

    IVerifier public verifier;

    event Deposit(bytes32 indexed commitments, uint32 leafIndex, uint256 timestamp);
    event Withdrawal(address to, bytes32 nullifierHashes);

    constructor(
        IVerifier _verifier,
        uint256 _amount,
        bytes32 _root,
        uint256[] memory _commitments
        // Hasher _hasher Will need a hasher to switch to an on-chain merkle tree
    ) payable {
        require(_amount > 0, "denomination should be greater than zero");
        require(msg.value > 0, "value of commitments to withdraw must be greater than zero");
        verifier = _verifier;
        amount = _amount;
        root = _root;
        for (uint i = 0; i < _commitments.length; i++) {
            commitments[_commitments[i]] = true;
        }
    }

    function withdraw(
        bytes calldata proof,
        bytes32 _root,
        uint256 _commitment
    ) external payable nonReentrant {
        uint256 recipient;
        bytes32 _nullifierHash;
        assembly {
                recipient := calldataload(add(calldataload(0x04), 0x24))
                _nullifierHash := calldataload(add(calldataload(0x04), 0x64))
        } 
        address payable _recipient = payable(address(uint160(recipient)));

        require(!nullifierHashes[_nullifierHash], "The note has been already spent");
        require(root == _root, "Cannot find your merkle root");
        require(commitments[_commitment], "Commitment is not found in the set!");
    
        bool proofResult = verifier.verify(proof);
        require(proofResult, "Invalid withdraw proof");

        // Set nullifier hash to true
        nullifierHashes[_nullifierHash] = true;

        require(msg.value == 0, "msg.value is supposed to be zero");

        (bool success, ) = _recipient.call{value: amount}("");
        require(success, "payment to _recipient did not go thru");

        emit Withdrawal(_recipient, _nullifierHash);
    }
}
