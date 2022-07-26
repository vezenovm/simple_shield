// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

// import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IVerifier {
    function verify(bytes calldata, bytes calldata) external view returns (bool);
}

contract PrivateTransfer {
    // amount deposited for each commitment
    uint256 public amount;
    bytes32 public root;

    mapping(bytes32 => bool) public nullifierHashes;
    // we store all commitments just to prevent accidental deposits with the same commitment
    // these have been switched to an array 
    //mapping(bytes32 => bool) public commitments;
    uint256[] public commitments;

    IVerifier public verifier;

    event Deposit(bytes32 indexed commitments, uint32 leafIndex, uint256 timestamp);
    event Withdrawal(address to, bytes32 nullifierHashes);

    constructor(
        IVerifier _verifier,
        uint256 _amount,
        bytes32 _root,
        uint256[] memory _commitments
        // Hasher _hasher Will need a hasher to switch to an on-chain merkle tree
    ) {
        require(_amount > 0, "denomination should be greater than zero");
        verifier = _verifier;
        amount = _amount;
        root = _root;
        commitments = _commitments;
    }

    function withdraw(
        bytes calldata proof,
        bytes calldata public_inputs,
        bytes32 _root,
        uint256 commitment,
        bytes32 _nullifierHash,
        address payable _recipient
    ) external payable {
        require(commitments[commitment] != 0, "Commitment is not found in the set!");
        require(!nullifierHashes[_nullifierHash], "The note has been already spent");
        require(root == _root, "Cannot find your merkle root");
        require(verifier.verify(proof, public_inputs), "Invalid withdraw proof");
        
        // Set nullifier hash to true
        nullifierHashes[_nullifierHash] = true;

        require(msg.value == 0, "msg.value is supposed to be zero for ETH instance");

        (bool success, ) = _recipient.call{value: amount}("");
        require(success, "payment to _recipient did not go thru");

        emit Withdrawal(_recipient, _nullifierHash);
    }
}
