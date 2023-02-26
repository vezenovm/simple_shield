// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0;

import "hardhat/console.sol";

interface IHasher {
  function MiMCpe7(uint256 in_xL, uint256 in_xR) external pure returns (uint256 out_x);
}

contract MerkleTreeWithHistory {
  uint256 public constant FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
  uint256 public constant ZERO_VALUE = 11237804666762892337261927141475050497255385386905029870942060923073236745571; // = sha256("simple_shield")
  IHasher public immutable hasher;

  uint32 public levels;

  // the following variables are made public for easier testing and debugging and
  // are not supposed to be accessed in regular code

  // filledSubtrees and roots could be bytes32[size], but using mappings makes it cheaper because
  // it removes index range check on every interaction
  mapping(uint256 => bytes32) public filledSubtrees;
  mapping(uint256 => bytes32) public roots;
  uint32 public constant ROOT_HISTORY_SIZE = 30;
  uint32 public currentRootIndex = 0;
  uint32 public nextIndex = 0;

  constructor(uint32 _levels, IHasher _hasher) {
    require(_levels > 0, "_levels should be greater than zero");
    require(_levels < 32, "_levels should be less than 32");
    levels = _levels;
    hasher = _hasher;

    for (uint32 i = 0; i < _levels; i++) {
      filledSubtrees[i] = zeros(i);
    }

    roots[0] = zeros(_levels - 1);
  }

  /**
    @dev Hash 2 tree leaves, returns MiMC(_left, _right)
  */
  function hashLeftRight(
    IHasher _hasher,
    bytes32 _left,
    bytes32 _right
  ) public pure returns (bytes32) {
    require(uint256(_left) < FIELD_SIZE, "_left should be inside the field");
    require(uint256(_right) < FIELD_SIZE, "_right should be inside the field");

    uint256 R = 0;
    uint256 hash_left = _hasher.MiMCpe7(uint256(_left), R);
    uint256 C = addmod(R, uint256(_left), FIELD_SIZE);
    R = addmod(C, hash_left, FIELD_SIZE);

    uint256 hash_right = _hasher.MiMCpe7(uint256(_right), R);
    C = addmod(R, uint256(_right), FIELD_SIZE);
    R = addmod(C, hash_right, FIELD_SIZE);
    return bytes32(R);
  }

  function _insert(bytes32 _leaf) internal returns (uint32 index) {
    uint32 _nextIndex = nextIndex;
    require(_nextIndex != uint32(2)**levels, "Merkle tree is full. No more leaves can be added");
    uint32 currentIndex = _nextIndex;
    bytes32 currentLevelHash = _leaf;
    bytes32 left;
    bytes32 right;

    for (uint32 i = 0; i < levels; i++) {
      if (currentIndex % 2 == 0) {
        left = currentLevelHash;
        right = zeros(i);
        filledSubtrees[i] = currentLevelHash;
      } else {
        left = filledSubtrees[i];
        right = currentLevelHash;
      }
      currentLevelHash = hashLeftRight(hasher, left, right);
      currentIndex /= 2;
    }

    uint32 newRootIndex = (currentRootIndex + 1) % ROOT_HISTORY_SIZE;
    currentRootIndex = newRootIndex;
    roots[newRootIndex] = currentLevelHash;
    nextIndex = _nextIndex + 1;
    return _nextIndex;
  }

  /**
    @dev Whether the root is present in the root history
  */
  function isKnownRoot(bytes32 _root) public view returns (bool) {
    if (_root == 0) {
      return false;
    }
    uint32 _currentRootIndex = currentRootIndex;
    uint32 i = _currentRootIndex;
    do {
      if (_root == roots[i]) {
        return true;
      }
      if (i == 0) {
        i = ROOT_HISTORY_SIZE;
      }
      i--;
    } while (i != _currentRootIndex);
    return false;
  }

  /**
    @dev Returns the last root
  */
  function getLastRoot() public view returns (bytes32) {
    return roots[currentRootIndex];
  }

  // MiMC7
  /// @dev provides Zero (Empty) elements for a MiMC MerkleTree. Up to 32 levels
  function zeros(uint256 i) public pure returns (bytes32) {
    if (i == 0) return bytes32(0x18d85f3de6dcd78b6ffbf5d8374433a5528d8e3bf2100df0b7bb43a4c59ebd63);
    else if (i == 1) return bytes32(0x1b7ba1a4ebccefab74ac08030f380fbeb0a005c73c75069e4d08fbb67d4984b9);
    else if (i == 2) return bytes32(0x0f40f15ccd167735cd35e2ee6390231f40433cf748434e7a0e8b26a95d96bf2d);
    else if (i == 3) return bytes32(0x0f5cd8fda3b157ee6abfe2e03574fccfcfbda04c3352dbc752b5fef8b3f2ba63);
    else if (i == 4) return bytes32(0x2e9eebf72534f3af74a1f7cf8cffa8a14636adbe8687c28a69d0780a8994c805);
    else if (i == 5) return bytes32(0x12d1d98e63513d4cb025d03332d999ab0900442da2fcb1df95a336e0fdf8f213);
    else if (i == 6) return bytes32(0x1f60f8095c2e79a4e225c5d56ef3800ba42a6079111ddcc204fb0cc3ffa299be);
    else if (i == 7) return bytes32(0x2f8942dfe817cb2651ac08ab69d6684b72300c2a5f1dedef06d37a454d6825a5);
    else if (i == 8) return bytes32(0x2bf112ea13ecd99e9598c67c3162641c5a50b9f8658d2f74187425a09baa0558);
    else if (i == 9) return bytes32(0x10b33055f79928f6ffe37bc2a6d659d2daa59517974e83579a62e3d784dee0f7);
    else if (i == 10) return bytes32(0x2b352dc87260db2518528fec72ead16600f64d90892438153d994412aa7979aa);
    else if (i == 11) return bytes32(0x2ece1801c22d99c4836f9230ad6e91531920941193da8a97ab66fc324d564f55);
    else if (i == 12) return bytes32(0x25a548fb4123e2f9c65dce1b1fef63f84f7dfa182d8256400dadbf65928340f2);
    else if (i == 13) return bytes32(0x2a155444e89f6c748271a42d46c464f4a559ccbe21863fc9d89174b85c3baf4a);
    else if (i == 14) return bytes32(0x144d2723fbe34f16b48486b26fbdbc9f5a8bf3592880de531e5eda143236e973);
    else if (i == 15) return bytes32(0x0b432563801b46021f76af41a11e9cc67a6b50b8e96abff9ce56ae1c4ee49a24);
    else if (i == 16) return bytes32(0x12863218999d4028bcb6b368576f1b27d8e7799d9d3a7a5b51275fcaf6e947a8);
    else if (i == 17) return bytes32(0x18a76aacf096329a5c05338b43c3bfcc6bcc029ba4f14f2d382a4ca1ab0f32f8);
    else if (i == 18) return bytes32(0x18b0c7b73799a38e7d55cc979dc1001f5a91c0668537f65cbf2167aa35a84bac);
    else if (i == 19) return bytes32(0x05ed576060dd3a40e12ddb2baab9258f06cb0ea196baf12ae09c6d8db33c60cd);
    else if (i == 20) return bytes32(0x0186f38effa0c7cb2881dda7416376cbfd3bb4483efd112e4050327fb329dad8);
    else if (i == 21) return bytes32(0x1f7ea159d59dd84ecd4d60fb26d64ea1a4232d7bb8cec0f7c143db09ca625817);
    else if (i == 22) return bytes32(0x2977e87f14e0c9127960db3f1ebffc451861269ca6c58a67b8fd456771bdfd2f);
    else if (i == 23) return bytes32(0x0ba0989570ba49e776445c79703cadd7b70becee10c927858ec5ee3023657d22);
    else if (i == 24) return bytes32(0x027de2f217f2242181c72b57933da15e648a191abd21dccc35d374422413a102);
    else if (i == 25) return bytes32(0x1617ed8a1001d222cf79c3b369379368a3795d84ff674f14aa9b954dc71370bf);
    else if (i == 26) return bytes32(0x06ec269b95d9f049b1581e8ba713f53b05d59c7b85c940a8da10cab1e62435ea);
    else if (i == 27) return bytes32(0x0f03bb38a086e049b783af3ba7276a05d793f074686d05305be324b557db19f8);
    else if (i == 28) return bytes32(0x20d17c486740036aaacfd5ab5379cf8a1844546fd1c0306fd9558bd0a99706f0);
    else if (i == 29) return bytes32(0x25dc69fba1a866f1527c8ac25093bdf36072a251b8072a5f93a76f7ac2ea9889);
    else if (i == 30) return bytes32(0x001406b4aa528a539cd3975b22c468a870a126afbb8ced0be7ae94b880054c64);
    else if (i == 31) return bytes32(0x17ae6930f06116e395d3600ffde7eb67115637a1fb28ce59aaff3ce2b018c61e);
    else revert("Index out of bounds");
  }
}
