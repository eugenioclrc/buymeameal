// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// import "hardhat/console.sol";

contract ProfileBuyMeAMeal is ERC721, ERC721URIStorage, Ownable {
    using ECDSA for bytes32;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(bytes32 => uint256) private _usernameToTokenId;
    mapping(uint256 => uint256) private _tokenIdToBalance;
    mapping(uint256 => uint256) private _tokenTotalGain;

    address public minter;
    // min amount to be donated
    uint256 public minDeposit = 1 ether;

    event ChangeMinter(address indexed previousMinter, address indexed newMinter);
    event UpdateMinDeposit(uint256 amount);
    event Gain(address donator, uint256 tokenId, uint256 amount);
    event TotalGain(uint256 indexed tokenId, uint256 tvl);
    event Withdraw(uint256 indexed tokenId, address owner, uint256 amount);
    event UpdateProfile(uint256 indexed tokenId, string url);
    event Update(uint256 indexed tokenId, string key, string data);

    constructor() ERC721("ProfileBuyMeAMeal", "BMAM") {
      // Initialize the tokenId counter in 1
      _tokenIdCounter.increment();
      minter = msg.sender;
    }

    function updateMinter(address _minter) external onlyOwner {
      minter = _minter;
      emit ChangeMinter(minter, _minter);
    }

    function updateMinDeposit(uint256 _amount) external onlyOwner {
      minDeposit = _amount;
      emit UpdateMinDeposit(_amount);
    }

    function safeMint(bytes32 _username, string memory uri, bytes calldata _signature) external {
        require(_usernameToTokenId[_username] == 0, "Username is registered");

        bytes32 signatureMsg = keccak256(
            abi.encodePacked(
                address(this),
                _username,
                uri
            )
        );

        require(
            minter == signatureMsg.toEthSignedMessageHash().recover(_signature),
            "Sorry, Invalid minter signature"
        );
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _usernameToTokenId[_username] = tokenId;
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @dev we just emit a event with the markdown url and the tokenId
    function updateProfile(uint256 tokenId, string calldata ipfsUrl) external {
        require(msg.sender == ownerOf(tokenId), "Only owner can update profile");
        emit UpdateProfile(tokenId, ipfsUrl);
    }

    function update(uint256 tokenId, string calldata key, string calldata data) external {
        require(msg.sender == ownerOf(tokenId), "Only owner can update profile");
        emit Update(tokenId, key, data);
    }

    function buyMeal(uint256 tokenId, bytes32) payable external {
        require(msg.value > minDeposit, "Sorry, you need to pay at least one meal the meal");
        unchecked{
            _tokenIdToBalance[tokenId] += msg.value;
            _tokenTotalGain[tokenId] += msg.value;
        }

        emit Gain(msg.sender, tokenId, msg.value);
        emit TotalGain(tokenId, _tokenTotalGain[tokenId]);
    }

    function withdraw(uint256 tokenId) external {
        require(_tokenIdToBalance[tokenId] > 0, "Sorry, vault is empty");
        require(msg.sender == ownerOf(tokenId), "Sorry, you are not the owner of this profile");
        
        uint256 amount = _tokenIdToBalance[tokenId];
        _tokenIdToBalance[tokenId] = 0;
        
        payable(msg.sender).transfer(amount);
        emit Withdraw(tokenId, msg.sender, amount);
    }

    function tokenID(bytes32 _username) external view returns (uint256) {
        return _usernameToTokenId[_username];
    }

    function tokenTVL(uint256 tokenId) external view returns (uint256) {
        return _tokenIdToBalance[tokenId];
    }
}