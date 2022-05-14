import { BigInt } from "@graphprotocol/graph-ts"
import {
  ProfileBuyMeAMeal,
  Approval,
  ApprovalForAll,
  ChangeMinter,
  Gain,
  OwnershipTransferred,
  TotalGain,
  Transfer,
  Update,
  UpdateMinDeposit,
  UpdateProfile,
  Withdraw
} from "../generated/ProfileBuyMeAMeal/ProfileBuyMeAMeal"
import { ExampleEntity, ProfileBuyMeAMeal } from "../generated/schema"


export function handleTransfer(event: Transfer): void {
  let token = ProfileBuyMeAMeal.load(event.params.tokenId.toString());
  if (!token) {
    token = new ProfileBuyMeAMeal(event.params.tokenId.toString());
    // token.creator = event.params.to.toHexString();
    // token.tokenID = event.params.tokenId;
  
    // let tokenContract = TokenContract.bind(event.address);
    // token.contentURI = tokenContract.tokenURI(event.params.tokenId);
    // token.tokenIPFSPath = tokenContract.getTokenIPFSPath(event.params.tokenId);
    // token.name = tokenContract.name();
    // token.createdAtTimestamp = event.block.timestamp;
  }
  // token.owner = event.params.to.toHexString();
  token.save();
  
  /*
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
  */
}

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
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.minDeposit(...)
  // - contract.minter(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenID(...)
  // - contract.tokenTVL(...)
  // - contract.tokenURI(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleChangeMinter(event: ChangeMinter): void {}

export function handleGain(event: Gain): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTotalGain(event: TotalGain): void {}

export function handleUpdate(event: Update): void {}

export function handleUpdateMinDeposit(event: UpdateMinDeposit): void {}

export function handleUpdateProfile(event: UpdateProfile): void {}

export function handleWithdraw(event: Withdraw): void {}
