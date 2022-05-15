// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class ProfileEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ProfileEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ProfileEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ProfileEntity", id.toString(), this);
    }
  }

  static load(id: string): ProfileEntity | null {
    return changetype<ProfileEntity | null>(store.get("ProfileEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get username(): string {
    let value = this.get("username");
    return value!.toString();
  }

  set username(value: string) {
    this.set("username", Value.fromString(value));
  }

  get avatar(): string | null {
    let value = this.get("avatar");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set avatar(value: string | null) {
    if (!value) {
      this.unset("avatar");
    } else {
      this.set("avatar", Value.fromString(<string>value));
    }
  }

  get color(): string | null {
    let value = this.get("color");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set color(value: string | null) {
    if (!value) {
      this.unset("color");
    } else {
      this.set("color", Value.fromString(<string>value));
    }
  }

  get textColor(): string | null {
    let value = this.get("textColor");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set textColor(value: string | null) {
    if (!value) {
      this.unset("textColor");
    } else {
      this.set("textColor", Value.fromString(<string>value));
    }
  }

  get backgroundimg(): string | null {
    let value = this.get("backgroundimg");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set backgroundimg(value: string | null) {
    if (!value) {
      this.unset("backgroundimg");
    } else {
      this.set("backgroundimg", Value.fromString(<string>value));
    }
  }

  get bio(): string | null {
    let value = this.get("bio");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set bio(value: string | null) {
    if (!value) {
      this.unset("bio");
    } else {
      this.set("bio", Value.fromString(<string>value));
    }
  }

  get createdAtTimestamp(): BigInt {
    let value = this.get("createdAtTimestamp");
    return value!.toBigInt();
  }

  set createdAtTimestamp(value: BigInt) {
    this.set("createdAtTimestamp", Value.fromBigInt(value));
  }

  get creator(): string {
    let value = this.get("creator");
    return value!.toString();
  }

  set creator(value: string) {
    this.set("creator", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value!.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type User must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("User", id.toString(), this);
    }
  }

  static load(id: string): User | null {
    return changetype<User | null>(store.get("User", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokens(): Array<string> {
    let value = this.get("tokens");
    return value!.toStringArray();
  }

  set tokens(value: Array<string>) {
    this.set("tokens", Value.fromStringArray(value));
  }

  get created(): Array<string> {
    let value = this.get("created");
    return value!.toStringArray();
  }

  set created(value: Array<string>) {
    this.set("created", Value.fromStringArray(value));
  }
}
