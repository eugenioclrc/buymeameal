import { BigInt, ipfs } from "@graphprotocol/graph-ts"
import ethers from 'ethers';
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
import { ProfileEntity } from "../generated/schema"

function rndColor() {
  const colors = ['264653','023047','d90429','2b2d42','001219','000000','231942','e85d04','2f3e46','b5179e','f72585','f95738','ff206e','132a13'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function handleTransfer(event: TransferEvent): void {
  let entity = ProfileEntity.load(event.params.tokenId.toString());
  if (!entity) {
    entity = new ProfileEntity(event.transaction.from.toHex())
    entity.id = event.params.tokenId.toString()
    let contract = ProfileBuyMeAMealContract.bind(event.address);
    entity.color = rndColor();
    entity.textColor = 'FFFFFF';
    entity.username = ethers.utils.parseBytes32String(await contract.tokenIdUsername(event.params.tokenId));
    entity.avatar = '';
    entity.backgroundimg = '';
    entity.bio = '';
  }
  entity.owner = event.params.to.toHexString();
  entity.save();
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

export function handleChangeMinter(event: ChangeMinter): void {}

export function handleDonate(event: Donate): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleProfileSetup(event: ProfileSetup): void {}

export function handleTotalGain(event: TotalGain): void {}


export function handleUpdate(event: Update): void {}

export function handleUpdateMinDeposit(event: UpdateMinDeposit): void {}

export function handleWithdraw(event: Withdraw): void {}
