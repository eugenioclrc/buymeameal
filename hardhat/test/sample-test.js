const { expect } = require("chai");
const { ethers } = require("hardhat");

let deployer, user;

describe("ProfileNFT", function() {
  it("Should return the new greeting once it's changed", async function() {
    [deployer, user] = await ethers.getSigners();

    const ProfileNFT = await ethers.getContractFactory("ProfileBuyMeAMeal", deployer);
    const profileNFT = await ProfileNFT.deploy();
    await profileNFT.deployed();

    const username = ethers.utils.formatBytes32String("Hello World");

    // 66 byte string, which represents 32 bytes of data
    let messageHash = ethers.utils.solidityKeccak256 (
                    ['address', 'bytes32', 'string'],
                    [profileNFT.address, username, 'url']);

    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);

    // To sign the 32 bytes of data, make sure you pass in the data
    let signature = await deployer.signMessage(messageHashBinary);


    await expect(profileNFT.safeMint(username, 'fakeurl', signature)).to.be.reverted;
    await profileNFT.safeMint(username, 'url', signature);

    await expect(profileNFT.safeMint(username, 'url', signature)).to.be.reverted;
      /*
    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    
    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
    */
  });
});
