/* eslint-disable */
import * as Long from "long";
import { util, configure, Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "crossdapp.gateway";

export interface Asset {
  chain: string;
  symbol: string;
  ticker: string;
  synth: boolean;
}

export interface Coin {
  asset: Asset | undefined;
  amount: string;
  decimals: number;
}

const baseAsset: object = { chain: "", symbol: "", ticker: "", synth: false };

export const Asset = {
  encode(message: Asset, writer: Writer = Writer.create()): Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.symbol !== "") {
      writer.uint32(18).string(message.symbol);
    }
    if (message.ticker !== "") {
      writer.uint32(26).string(message.ticker);
    }
    if (message.synth === true) {
      writer.uint32(32).bool(message.synth);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Asset {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAsset } as Asset;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.symbol = reader.string();
          break;
        case 3:
          message.ticker = reader.string();
          break;
        case 4:
          message.synth = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Asset {
    const message = { ...baseAsset } as Asset;
    if (object.chain !== undefined && object.chain !== null) {
      message.chain = String(object.chain);
    } else {
      message.chain = "";
    }
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = String(object.symbol);
    } else {
      message.symbol = "";
    }
    if (object.ticker !== undefined && object.ticker !== null) {
      message.ticker = String(object.ticker);
    } else {
      message.ticker = "";
    }
    if (object.synth !== undefined && object.synth !== null) {
      message.synth = Boolean(object.synth);
    } else {
      message.synth = false;
    }
    return message;
  },

  toJSON(message: Asset): unknown {
    const obj: any = {};
    message.chain !== undefined && (obj.chain = message.chain);
    message.symbol !== undefined && (obj.symbol = message.symbol);
    message.ticker !== undefined && (obj.ticker = message.ticker);
    message.synth !== undefined && (obj.synth = message.synth);
    return obj;
  },

  fromPartial(object: DeepPartial<Asset>): Asset {
    const message = { ...baseAsset } as Asset;
    if (object.chain !== undefined && object.chain !== null) {
      message.chain = object.chain;
    } else {
      message.chain = "";
    }
    if (object.symbol !== undefined && object.symbol !== null) {
      message.symbol = object.symbol;
    } else {
      message.symbol = "";
    }
    if (object.ticker !== undefined && object.ticker !== null) {
      message.ticker = object.ticker;
    } else {
      message.ticker = "";
    }
    if (object.synth !== undefined && object.synth !== null) {
      message.synth = object.synth;
    } else {
      message.synth = false;
    }
    return message;
  },
};

const baseCoin: object = { amount: "", decimals: 0 };

export const Coin = {
  encode(message: Coin, writer: Writer = Writer.create()): Writer {
    if (message.asset !== undefined) {
      Asset.encode(message.asset, writer.uint32(10).fork()).ldelim();
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.decimals !== 0) {
      writer.uint32(24).int64(message.decimals);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Coin {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCoin } as Coin;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.asset = Asset.decode(reader, reader.uint32());
          break;
        case 2:
          message.amount = reader.string();
          break;
        case 3:
          message.decimals = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Coin {
    const message = { ...baseCoin } as Coin;
    if (object.asset !== undefined && object.asset !== null) {
      message.asset = Asset.fromJSON(object.asset);
    } else {
      message.asset = undefined;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = String(object.amount);
    } else {
      message.amount = "";
    }
    if (object.decimals !== undefined && object.decimals !== null) {
      message.decimals = Number(object.decimals);
    } else {
      message.decimals = 0;
    }
    return message;
  },

  toJSON(message: Coin): unknown {
    const obj: any = {};
    message.asset !== undefined &&
      (obj.asset = message.asset ? Asset.toJSON(message.asset) : undefined);
    message.amount !== undefined && (obj.amount = message.amount);
    message.decimals !== undefined && (obj.decimals = message.decimals);
    return obj;
  },

  fromPartial(object: DeepPartial<Coin>): Coin {
    const message = { ...baseCoin } as Coin;
    if (object.asset !== undefined && object.asset !== null) {
      message.asset = Asset.fromPartial(object.asset);
    } else {
      message.asset = undefined;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = "";
    }
    if (object.decimals !== undefined && object.decimals !== null) {
      message.decimals = object.decimals;
    } else {
      message.decimals = 0;
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
