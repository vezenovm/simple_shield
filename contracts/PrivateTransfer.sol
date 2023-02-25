// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

import "./MerkleTreeWithHistory.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

interface IVerifier {
    function verify(bytes calldata) external view returns (bool);
}

contract PrivateTransfer is MerkleTreeWithHistory, ReentrancyGuard {
    IVerifier public verifier;
    // uint256 public denomination;

    // amount deposited for each commitment
    uint256 public amount;
    bytes32 public root;

    // a nullifier is necessary to prevent someone from performing the same withdrawal twice
    mapping(bytes32 => bool) public nullifierHashes;
    // we store all commitments just to prevent accidental deposits with the same commitment
    mapping(bytes32 => bool) public commitments;

    event Deposit(bytes32 indexed commitments, uint32 leafIndex, uint256 timestamp);
    event Withdrawal(address to, bytes32 nullifierHashes);

    // constructor(
    //     IVerifier _verifier,
    //     uint256 _amount,
    //     bytes32 _root,
    //     uint256[] memory _commitments
    //     // Hasher _hasher Will need a hasher to switch to an on-chain merkle tree
    // ) payable {
    //     require(_amount > 0, "denomination should be greater than zero");
    //     require(msg.value > 0, "value of commitments to withdraw must be greater than zero");
    //     verifier = _verifier;
    //     amount = _amount;
    //     root = _root;
    //     for (uint i = 0; i < _commitments.length; i++) {
    //         commitments[_commitments[i]] = true;
    //     }
    // }

    /**
        @dev The constructor
        @param _verifier the address of SNARK verifier for this contract
        @param _hasher the address of MiMC hash contract
        @param _amount transfer amount for each deposit
        @param _merkleTreeHeight the height of deposits' Merkle Tree
    */
    constructor(
        IVerifier _verifier,
        IHasher _hasher,
        uint256 _amount,
        uint32 _merkleTreeHeight
    ) MerkleTreeWithHistory(_merkleTreeHeight, _hasher) {
        require(_amount > 0, "denomination should be greater than 0");
        verifier = _verifier;
        amount = _amount;
    }

    /**
        @dev Deposit funds into the contract. The caller must send (for ETH) or approve (for ERC20) value equal to or `denomination` of this instance.
        @param _commitment the note commitment, which is PedersenHash(nullifier + secret)
    */
    function deposit(bytes32 _commitment) external payable nonReentrant {
        require(!commitments[_commitment], "The commitment has been submitted");

        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;

        require(msg.value == amount, "Please send `mixAmount` ETH along with transaction");

        emit Deposit(_commitment, insertedIndex, block.timestamp);
    }

    /**
        @dev Withdraw a deposit from the contract. `proof` is a zkSNARK proof data, and input is an array of circuit public inputs
        `input` array consists of:
        - merkle root of all deposits in the contract
        - hash of unique deposit nullifier to prevent double spends
        - the recipient of funds
        - optional fee that goes to the transaction sender (usually a relay)
    */
    function withdraw(
        bytes calldata proof, // TOOD: separate public inputs before 
        bytes32 _root,
        bytes32 _commitment
    ) external payable nonReentrant {
        // console.log('_root: ');
        // console.logBytes32(_root);

        uint256 recipient;
        bytes32 _nullifierHash;
        assembly {
                recipient := calldataload(add(calldataload(0x04), 0x24))
                _nullifierHash := calldataload(add(calldataload(0x04), 0x64))
        } 
        address payable _recipient = payable(address(uint160(recipient)));

        require(!nullifierHashes[_nullifierHash], "The note has been already spent");
        // require(root == _root, "Cannot find your merkle root");
        require(isKnownRoot(_root), "Cannot find your merkle root");
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
