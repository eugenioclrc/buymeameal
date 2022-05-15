const { expect } = require("chai");
const { ethers } = require("hardhat");

let deployer, user;
let profileNFT;

async function createSignature(deployer, userAddress, username) {

    // 66 byte string, which represents 32 bytes of data
    let messageHash = ethers.utils.solidityKeccak256 (
                    ['address', 'address', 'bytes32'],
                    [profileNFT.address, userAddress, username]);
    
                    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);
    
    // To sign the 32 bytes of data, make sure you pass in the data
    return await deployer.signMessage(messageHashBinary);
}

describe("ProfileNFT", function() {

  before(async function() {
    [deployer, user] = await ethers.getSigners();

    const ProfileNFT = await ethers.getContractFactory("ProfileBuyMeAMeal", deployer);
    profileNFT = await ProfileNFT.deploy();
    await profileNFT.deployed();
  });

  it("Should create a profile nft", async function() {

    const profileUrl = "Hello World";
    const profileUrl32 = ethers.utils.formatBytes32String(profileUrl);
    const fakeProfileUrl32 = ethers.utils.formatBytes32String("changeurl");

    const signature = await createSignature(deployer, deployer.address, profileUrl32);

    // change the address who will recibe the profileNFT must revert
    await expect(profileNFT.safeMint(profileUrl32, user.address, signature)).to.be.reverted;
    // change the username should revert (bad signature)
    await expect(profileNFT.safeMint(fakeProfileUrl32, deployer.address, signature)).to.be.reverted;
    // mint a nft
    await profileNFT.safeMint(profileUrl32, deployer.address, signature);
    // reusing the same signature should revert
    await expect(profileNFT.safeMint(profileUrl32, deployer.address, signature)).to.be.reverted;
    

    console.log(await profileNFT.tokenURI(1));   
    /*
    lets manually check url to speed up dev :D
    */
  });

  it("Should create a profile nft for user", async function() {

    const profileUrl = "myuser";
    const profileUrl32 = ethers.utils.formatBytes32String(profileUrl);
    const fakeProfileUrl32 = ethers.utils.formatBytes32String("Hello World");

    const signature = await createSignature(deployer, user.address, profileUrl32);

    profileNFT = profileNFT.connect(user);
    
    // change the address who will recibe the profileNFT must revert
    await expect(profileNFT.safeMint(profileUrl32, deployer.address, signature)).to.be.reverted;
    await expect(profileNFT.safeMint(fakeProfileUrl32, deployer.address, signature)).to.be.reverted;
    // change the username should revert (bad signature)
    await expect(profileNFT.safeMint(fakeProfileUrl32, user.address, signature)).to.be.reverted;
    // mint a nft
    await profileNFT.safeMint(profileUrl32, user.address, signature);
    // reusing the same signature should revert
    await expect(profileNFT.safeMint(profileUrl32, user.address, signature)).to.be.reverted;
    

    const token1 = await profileNFT.tokenURI(1);
    const token2 = await profileNFT.tokenURI(2);
    expect(token1).not.equal(token2);
    /*
    lets manually check url to speed up dev :D
    */
  });

});
