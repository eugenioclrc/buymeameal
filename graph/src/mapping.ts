import { BigInt, ipfs } from "@graphprotocol/graph-ts"
// import {ethers} from 'ethers';
import {
  ProfileBuyMeAMeal as ProfileBuyMeAMealContract,
  Approval,
  ApprovalForAll,
  ChangeMinter,
  Donate,
  OwnershipTransferred,
  ProfileSetup,
  TotalGain,
  Transfer as TransferEvent,
  Update,
  UpdateMinDeposit,
  Withdraw
} from "../generated/ProfileBuyMeAMeal/ProfileBuyMeAMeal"
import { ProfileEntity, User, Support } from "../generated/schema"


export function handleTransfer(event: TransferEvent): void {
  let entity = ProfileEntity.load(event.params.tokenId.toString());
  if (!entity) {
    entity = new ProfileEntity(event.transaction.from.toHex())
    entity.id = event.params.tokenId.toString()
    let contract = ProfileBuyMeAMealContract.bind(event.address);
    entity.color = '001219';
    entity.username = contract.bytes32ToString(contract.tokenIdUsername(event.params.tokenId));
    entity.avatar = '';
    entity.backgroundimg = '';
    entity.bio = '';
    entity.totalSupporters = BigInt.zero();

    entity.creator = event.params.to.toHexString();
    entity.createdAtTimestamp = event.block.timestamp;
  }
  // let nameToProfile = NameToProfileId.load(entity.username);
  // if (!nameToProfile) {
  //   nameToProfile = new NameToProfileId(entity.username);
  //   nameToProfile.id = event.params.tokenId.toString();
  //   nameToProfile.save();
  // }
  entity.owner = event.params.to.toHex();
  entity.save();
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}


export function handleDonate(event: Donate): void {
  let contract = ProfileBuyMeAMealContract.bind(event.address);
  let support = Support.load(event.params.tokenId.toString()+'-'+event.transaction.hash.toHexString());
  if(!support) {
    support = new Support(event.params.tokenId.toString()+'-'+event.transaction.hash.toHexString());
  }

  let entity = ProfileEntity.load(event.params.tokenId.toString());
  if(entity) {
    entity.totalSupporters += BigInt.fromString("1");
    entity.save();
  }
  
  support.profile = event.params.tokenId.toString();
  support.createdAtTimestamp = event.block.timestamp;
  support.supporter = event.transaction.from.toHexString();
  support.author = contract.bytes32ToString(event.params.twitter);
  support.message = event.params.msg;
  support.amount = event.transaction.value;
  support.save();
}


export function handleUpdate(event: Update): void {
  let entity = ProfileEntity.load(event.params.tokenId.toString());
  if (entity) {
    if(event.params.key == 'color') {
      entity.color = event.params.data;
    } else if(event.params.key == 'username') {
      entity.username = event.params.data;
    } else if(event.params.key == 'avatar') {
      entity.avatar = event.params.data;
    } else if(event.params.key == 'backgroundimg') {
      entity.backgroundimg = event.params.data;
    } else if(event.params.key == 'bio') {
      entity.bio = event.params.data;
    }
    entity.save();
  }
}

/*
export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.bytes32ToString(...)
  // - contract.contractURI(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.minDeposit(...)
  // - contract.minter(...)
  // - contract.multicall(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenIdToBalance(...)
  // - contract.tokenIdUsername(...)
  // - contract.tokenTotalGain(...)
  // - contract.tokenURI(...)
  // - contract.usernameToTokenId(...)
}
*/
export function handleApprovalForAll(event: ApprovalForAll): void {}


export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleProfileSetup(event: ProfileSetup): void {}

export function handleTotalGain(event: TotalGain): void {
  let entity = ProfileEntity.load(event.params.tokenId.toString());
  if (entity) {
    let contract = ProfileBuyMeAMealContract.bind(event.address);
    entity.totalGain = contract.tokenTotalGain(event.params.tokenId);
    entity.save();
  }
}

export function handleUpdateMinDeposit(event: UpdateMinDeposit): void {}

export function handleWithdraw(event: Withdraw): void {
  let entity = ProfileEntity.load(event.params.tokenId.toString());
  if (entity) {
    entity.balance = new BigInt(0);
    entity.save();
  }
}
