// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import '@openzeppelin/contracts/utils/Base64.sol';
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "@openzeppelin/contracts/utils/Multicall.sol";

// import "hardhat/console.sol";

contract ProfileBuyMeAMeal is ERC721, Ownable, Multicall {
    using ECDSA
    for bytes32;
    using Counters
    for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(bytes32 => uint256) public usernameToTokenId;
    mapping(uint256 => bytes32) public tokenIdUsername;
    mapping(uint256 => uint256) public tokenIdToBalance;
    mapping(uint256 => uint256) public tokenTotalGain;

    string public contractURI;
    address public minter;
    // min amount to be donated
    uint256 public minDeposit = 1 ether;

    event ChangeMinter(address indexed previousMinter, address indexed newMinter);
    event UpdateMinDeposit(uint256 amount);
    event Donate(address indexed donator, uint256 indexed tokenId, uint256 amount, bytes32 twitter, string msg);
    event TotalGain(uint256 indexed tokenId, uint256 tvl);
    event Withdraw(uint256 indexed tokenId, address owner, uint256 amount);
    event Update(uint256 indexed tokenId, string key, string data);
    event ProfileSetup(uint256 indexed tokenId, string username);

    constructor() ERC721("ProfileBuyMeAMeal", "BMAM") {
        // Initialize the tokenId counter in 1
        // this is need due line;
        // require(usernameToTokenId[_username] == 0, "Username is registered");
        _tokenIdCounter.increment();
        minter = msg.sender;
    }

    function updateContractURI(string memory _contractURI) external onlyOwner {
        contractURI = _contractURI;
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
        require(usernameToTokenId[_username] == 0, "Username is registered");

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
        usernameToTokenId[_username] = tokenId;
        tokenIdUsername[tokenId] = _username;

        emit ProfileSetup(tokenId, string(abi.encodePacked(_username)));
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    /// @dev we just emit a event with the markdown url and the tokenId
    function update(uint256 tokenId, string calldata key, string calldata data) external {
        require(msg.sender == ownerOf(tokenId), "Only owner can update profile");
        emit Update(tokenId, key, data);
    }

    function buyMeal(uint256 tokenId, bytes32 _from, string memory _msg) payable external {
        require(msg.value > minDeposit, "Sorry, you need to pay at least one meal the meal");
        unchecked {
            tokenIdToBalance[tokenId] += msg.value;
            tokenTotalGain[tokenId] += msg.value;
        }

        emit Donate(msg.sender, tokenId, msg.value, _from, _msg);
        emit TotalGain(tokenId, tokenTotalGain[tokenId]);
    }

    function withdraw(uint256 tokenId) external {
        require(tokenIdToBalance[tokenId] > 0, "Sorry, vault is empty");
        require(msg.sender == ownerOf(tokenId), "Sorry, you are not the owner of this profile");

        uint256 amount = tokenIdToBalance[tokenId];
        tokenIdToBalance[tokenId] = 0;

        payable(msg.sender).transfer(amount);
        emit Withdraw(tokenId, msg.sender, amount);
    }


    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721)
    returns(string memory) {
        return
        string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked('{"name":"', bytes32ToString(tokenIdUsername[tokenId]), '", "image":"',
                            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE3LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDM4My42NzUgMzgzLjY3NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzgzLjY3NSAzODMuNjc1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBpZD0iWE1MSURfMTUwOV8iIGQ9Ik0xMjUuMDQyLDMwOS40NzNjMCwzLjg2Ni0zLjEzNCw3LTcsN2gtMi4xMDZjLTMuODY2LDAtNy0zLjEzNC03LTdzMy4xMzQtNyw3LTdoMi4xMDYNCglDMTIxLjkwOSwzMDIuNDczLDEyNS4wNDIsMzA1LjYwNiwxMjUuMDQyLDMwOS40NzN6IE0xMTguMDQyLDI0Ny43MjNoLTIuMTA2Yy0zLjg2NiwwLTcsMy4xMzQtNyw3czMuMTM0LDcsNyw3aDIuMTA2DQoJYzMuODY2LDAsNy0zLjEzNCw3LTdTMTIxLjkwOSwyNDcuNzIzLDExOC4wNDIsMjQ3LjcyM3ogTTcxLjE1NSwyODkuMDk5aDIuMTA2YzMuODY2LDAsNy0zLjEzNCw3LTdzLTMuMTM0LTctNy03aC0yLjEwNg0KCWMtMy44NjYsMC03LDMuMTM0LTcsN1M2Ny4yODksMjg5LjA5OSw3MS4xNTUsMjg5LjA5OXogTTg0LjI5NSwyNjEuNzIzaDIuMTA3YzMuODY2LDAsNy0zLjEzNCw3LTdzLTMuMTM0LTctNy03aC0yLjEwNw0KCWMtMy44NjYsMC03LDMuMTM0LTcsN1M4MC40MjksMjYxLjcyMyw4NC4yOTUsMjYxLjcyM3ogTTczLjI2MSwyMjAuMzQ5aC0yLjEwNmMtMy44NjYsMC03LDMuMTM0LTcsN3MzLjEzNCw3LDcsN2gyLjEwNg0KCWMzLjg2NiwwLDctMy4xMzQsNy03Uzc3LjEyNywyMjAuMzQ5LDczLjI2MSwyMjAuMzQ5eiBNMTM5LjUyOCwzNDcuOTkzYzAsMy44NjYtMy4xMzQsNy03LDdIMTkuMTM4Yy0zLjg2NiwwLTctMy4xMzQtNy03VjE3My40NzkNCgljMC0wLjI3NiwwLjAxNy0wLjU1MiwwLjA0OS0wLjgyNkwzMS45NzgsNi4xNzRDMzIuMzk3LDIuNjUyLDM1LjM4MywwLDM4LjkyOSwwaDIwMy45ODljMy41NDQsMCw2LjUyOSwyLjY0OCw2Ljk1LDYuMTY4bDUuNDQyLDQ1LjQ1DQoJYzAuNDYsMy44MzgtMi4yNzksNy4zMjItNi4xMTgsNy43ODJjLTMuODMzLDAuNDY1LTcuMzIyLTIuMjc5LTcuNzgyLTYuMTE4TDIzNi43MDcsMTRoLTY4LjU2OXY3Mi40ODUNCgljMCwyLjQwOC0xLjIzOCw0LjY0Ny0zLjI3OCw1LjkyOWMtMi4wNDEsMS4yOC00LjU5NiwxLjQyMS02Ljc2NCwwLjM3NkwxMzUuODEsODIuMDM3TDExMy41MjQsOTIuNzkNCgljLTIuMTY4LDEuMDQ1LTQuNzI1LDAuOTAzLTYuNzY0LTAuMzc2Yy0yLjA0LTEuMjgxLTMuMjc4LTMuNTIxLTMuMjc4LTUuOTI5VjE0SDQ1LjE0NkwyNi4xMzgsMTczLjg5NHYxNjcuMWgxMDYuMzkNCglDMTM2LjM5NCwzNDAuOTkzLDEzOS41MjgsMzQ0LjEyNywxMzkuNTI4LDM0Ny45OTN6IE0xMTcuNDgyLDc1LjMzNmwxNS4yODYtNy4zNzZjMS45MjMtMC45MjgsNC4xNjMtMC45MjcsNi4wODQsMGwxNS4yODUsNy4zNzZWMTQNCgloLTM2LjY1NVY3NS4zMzZ6IE0yNzAuNjYyLDEzNy40NjljLTIuMDUxLDMuMjc2LTEuMDU4LDcuNTk2LDIuMjIsOS42NDdjMS4xNTQsMC43MjMsMi40MzgsMS4wNjcsMy43MDcsMS4wNjcNCgljMi4zMzIsMCw0LjYxMS0xLjE2NSw1Ljk0LTMuMjg3YzkuNzY4LTE1LjYwNCwxLjE0Ni0yOC42MDctNS4xNDktMzguMTAzYy02LjUyNi05Ljg0NC05LjcxMS0xNS4zMzQtNC45NTEtMjIuOTM4DQoJYzIuMDUxLTMuMjc2LDEuMDU4LTcuNTk2LTIuMjItOS42NDdjLTMuMjc3LTIuMDUzLTcuNTk4LTEuMDU3LTkuNjQ3LDIuMjJjLTkuNzY3LDE1LjYwMy0xLjE0NiwyOC42MDYsNS4xNSwzOC4xMDINCglDMjcyLjIzOCwxMjQuMzc0LDI3NS40MjEsMTI5Ljg2NSwyNzAuNjYyLDEzNy40Njl6IE0yNDMuNjk3LDE0Ny4xMTZjMS4xNTQsMC43MjMsMi40MzgsMS4wNjcsMy43MDcsMS4wNjcNCgljMi4zMzIsMCw0LjYxMS0xLjE2NSw1Ljk0LTMuMjg3YzkuNzY4LTE1LjYwNCwxLjE0Ni0yOC42MDctNS4xNDktMzguMTAzYy02LjUyNy05Ljg0NC05LjcxMS0xNS4zMzQtNC45NTItMjIuOTM4DQoJYzIuMDUxLTMuMjc3LDEuMDU4LTcuNTk3LTIuMjItOS42NDdjLTMuMjc3LTIuMDUzLTcuNTk4LTEuMDU3LTkuNjQ3LDIuMjJjLTkuNzY3LDE1LjYwNC0xLjE0NSwyOC42MDYsNS4xNSwzOC4xMDINCgljNi41MjcsOS44NDQsOS43MTEsMTUuMzM1LDQuOTUxLDIyLjkzOEMyMzkuNDI2LDE0MC43NDUsMjQwLjQxOSwxNDUuMDY0LDI0My42OTcsMTQ3LjExNnogTTI5My42MjQsMTk2LjA0M2gtMi4xMDYNCgljLTMuODY2LDAtNywzLjEzNC03LDdzMy4xMzQsNyw3LDdoMi4xMDZjMy44NjYsMCw3LTMuMTM0LDctN1MyOTcuNDksMTk2LjA0MywyOTMuNjI0LDE5Ni4wNDN6IE0yNTguMDA2LDE4Ny44NTNoLTIuMTA3DQoJYy0zLjg2NiwwLTcsMy4xMzQtNyw3czMuMTM0LDcsNyw3aDIuMTA3YzMuODY2LDAsNy0zLjEzNCw3LTdTMjYxLjg3MywxODcuODUzLDI1OC4wMDYsMTg3Ljg1M3ogTTMyOS41MiwyNzUuNzUzDQoJYy0zLjg2NiwwLTcsMy4xMzQtNyw3YzAsMjkuOTctMjQuMzgzLDU0LjM1Mi01NC4zNTMsNTQuMzUyYy0zLjg2NiwwLTcsMy4xMzQtNyw3czMuMTM0LDcsNyw3YzM3LjY4OSwwLDY4LjM1My0zMC42NjIsNjguMzUzLTY4LjM1Mg0KCUMzMzYuNTIsMjc4Ljg4NywzMzMuMzg2LDI3NS43NTMsMzI5LjUyLDI3NS43NTN6IE0zNzEuNTM3LDIyOC45MTJ2NTYuODA3YzAsNTQuMDEzLTQzLjk0Myw5Ny45NTYtOTcuOTU4LDk3Ljk1NmgtMzMuMjUxDQoJYy01NC4wMTUsMC05Ny45NTgtNDMuOTQzLTk3Ljk1OC05Ny45NTZ2LTU2LjgwN2MwLTMuODY2LDMuMTM0LTcsNy03aDguOTc4YzEyLjAxMS0zNS4xODMsNTIuNDQxLTYwLjE4OCw5OC42MDQtNjAuMTg4DQoJczg2LjU5NCwyNS4wMDYsOTguNjA0LDYwLjE4OGg4Ljk4QzM2OC40MDMsMjIxLjkxMiwzNzEuNTM3LDIyNS4wNDYsMzcxLjUzNywyMjguOTEyeiBNMTczLjM1LDIyMS45MTJoMTY3LjIwMw0KCWMtMTEuOTQtMjcuMjI5LTQ1LjQyOC00Ni4xODgtODMuNjAyLTQ2LjE4OFMxODUuMjkxLDE5NC42ODMsMTczLjM1LDIyMS45MTJ6IE0zNTcuNTM3LDIzNS45MTJoLTcuMDU0DQoJYy0wLjEwMSwwLjAwMi0wLjIwMSwwLjAwMi0wLjMsMEgxNjMuNzJjLTAuMSwwLjAwMS0wLjIsMC4wMDEtMC4zLDBoLTcuMDUxdjQ5LjgwN2MwLDQ2LjI5NCwzNy42NjMsODMuOTU2LDgzLjk1OCw4My45NTZoMzMuMjUxDQoJYzQ2LjI5NSwwLDgzLjk1OC0zNy42NjIsODMuOTU4LTgzLjk1NlYyMzUuOTEyeiBNODQuMjk1LDMxNi40NzNoMi4xMDdjMy44NjYsMCw3LTMuMTM0LDctN3MtMy4xMzQtNy03LTdoLTIuMTA3DQoJYy0zLjg2NiwwLTcsMy4xMzQtNyw3UzgwLjQyOSwzMTYuNDczLDg0LjI5NSwzMTYuNDczeiBNMjIyLjM4OSwxOTYuMDQzaC0yLjEwNmMtMy44NjYsMC03LDMuMTM0LTcsN3MzLjEzNCw3LDcsN2gyLjEwNg0KCWMzLjg2NiwwLDctMy4xMzQsNy03UzIyNi4yNTUsMTk2LjA0MywyMjIuMzg5LDE5Ni4wNDN6IE05OS41NDQsMjg5LjA5OWMzLjg2NiwwLDctMy4xMzQsNy03cy0zLjEzNC03LTctN2gtMi4xMDYNCgljLTMuODY2LDAtNywzLjEzNC03LDdzMy4xMzQsNyw3LDdIOTkuNTQ0eiBNNTQuNzYyLDI0Ny43MjNoLTIuMTA2Yy0zLjg2NiwwLTcsMy4xMzQtNyw3czMuMTM0LDcsNyw3aDIuMTA2YzMuODY2LDAsNy0zLjEzNCw3LTcNCglTNTguNjI4LDI0Ny43MjMsNTQuNzYyLDI0Ny43MjN6IE01NC43NjIsMzAyLjQ3M2gtMi4xMDZjLTMuODY2LDAtNywzLjEzNC03LDdzMy4xMzQsNyw3LDdoMi4xMDZjMy44NjYsMCw3LTMuMTM0LDctNw0KCVM1OC42MjgsMzAyLjQ3Myw1NC43NjIsMzAyLjQ3M3oiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K',
                            '"}')
                    )
                )
            )
        );
    }


    function bytes32ToString(bytes32 _bytes32) public pure returns(string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            unchecked {
                i++;
            }
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0;) {
            bytesArray[i] = _bytes32[i];
            unchecked {
                i++;
            }
        }
        return string(bytesArray);
    }

}