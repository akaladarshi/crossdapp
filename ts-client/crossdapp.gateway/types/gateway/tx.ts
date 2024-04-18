/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";
import { Coin } from "../gateway/types";

export const protobufPackage = "crossdapp.gateway";

export interface DepositRequest {
  creator: string;
  port: string;
  channelID: string;
  timeoutTimestamp: number;
  coins: Coin[];
  memo: string;
  signer: Uint8Array;
  receiver: string;
}

export interface DepositResponse {}

const baseDepositRequest: object = {
  creator: "",
  port: "",
  channelID: "",
  timeoutTimestamp: 0,
  memo: "",
  receiver: "",
};

export const DepositRequest = {
  encode(message: DepositRequest, writer: Writer = Writer.create()): Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.port !== "") {
      writer.uint32(18).string(message.port);
    }
    if (message.channelID !== "") {
      writer.uint32(26).string(message.channelID);
    }
    if (message.timeoutTimestamp !== 0) {
      writer.uint32(32).uint64(message.timeoutTimestamp);
    }
    for (const v of message.coins) {
      Coin.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.memo !== "") {
      writer.uint32(50).string(message.memo);
    }
    if (message.signer.length !== 0) {
      writer.uint32(58).bytes(message.signer);
    }
    if (message.receiver !== "") {
      writer.uint32(66).string(message.receiver);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DepositRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDepositRequest } as DepositRequest;
    message.coins = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.port = reader.string();
          break;
        case 3:
          message.channelID = reader.string();
          break;
        case 4:
          message.timeoutTimestamp = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.coins.push(Coin.decode(reader, reader.uint32()));
          break;
        case 6:
          message.memo = reader.string();
          break;
        case 7:
          message.signer = reader.bytes();
          break;
        case 8:
          message.receiver = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DepositRequest {
    const message = { ...baseDepositRequest } as DepositRequest;
    message.coins = [];
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
    }
    if (object.port !== undefined && object.port !== null) {
      message.port = String(object.port);
    } else {
      message.port = "";
    }
    if (object.channelID !== undefined && object.channelID !== null) {
      message.channelID = String(object.channelID);
    } else {
      message.channelID = "";
    }
    if (
      object.timeoutTimestamp !== undefined &&
      object.timeoutTimestamp !== null
    ) {
      message.timeoutTimestamp = Number(object.timeoutTimestamp);
    } else {
      message.timeoutTimestamp = 0;
    }
    if (object.coins !== undefined && object.coins !== null) {
      for (const e of object.coins) {
        message.coins.push(Coin.fromJSON(e));
      }
    }
    if (object.memo !== undefined && object.memo !== null) {
      message.memo = String(object.memo);
    } else {
      message.memo = "";
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = bytesFromBase64(object.signer);
    }
    if (object.receiver !== undefined && object.receiver !== null) {
      message.receiver = String(object.receiver);
    } else {
      message.receiver = "";
    }
    return message;
  },

  toJSON(message: DepositRequest): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.port !== undefined && (obj.port = message.port);
    message.channelID !== undefined && (obj.channelID = message.channelID);
    message.timeoutTimestamp !== undefined &&
      (obj.timeoutTimestamp = message.timeoutTimestamp);
    if (message.coins) {
      obj.coins = message.coins.map((e) => (e ? Coin.toJSON(e) : undefined));
    } else {
      obj.coins = [];
    }
    message.memo !== undefined && (obj.memo = message.memo);
    message.signer !== undefined &&
      (obj.signer = base64FromBytes(
        message.signer !== undefined ? message.signer : new Uint8Array()
      ));
    message.receiver !== undefined && (obj.receiver = message.receiver);
    return obj;
  },

  fromPartial(object: DeepPartial<DepositRequest>): DepositRequest {
    const message = { ...baseDepositRequest } as DepositRequest;
    message.coins = [];
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
    }
    if (object.port !== undefined && object.port !== null) {
      message.port = object.port;
    } else {
      message.port = "";
    }
    if (object.channelID !== undefined && object.channelID !== null) {
      message.channelID = object.channelID;
    } else {
      message.channelID = "";
    }
    if (
      object.timeoutTimestamp !== undefined &&
      object.timeoutTimestamp !== null
    ) {
      message.timeoutTimestamp = object.timeoutTimestamp;
    } else {
      message.timeoutTimestamp = 0;
    }
    if (object.coins !== undefined && object.coins !== null) {
      for (const e of object.coins) {
        message.coins.push(Coin.fromPartial(e));
      }
    }
    if (object.memo !== undefined && object.memo !== null) {
      message.memo = object.memo;
    } else {
      message.memo = "";
    }
    if (object.signer !== undefined && object.signer !== null) {
      message.signer = object.signer;
    } else {
      message.signer = new Uint8Array();
    }
    if (object.receiver !== undefined && object.receiver !== null) {
      message.receiver = object.receiver;
    } else {
      message.receiver = "";
    }
    return message;
  },
};

const baseDepositResponse: object = {};

export const DepositResponse = {
  encode(_: DepositResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DepositResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDepositResponse } as DepositResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): DepositResponse {
    const message = { ...baseDepositResponse } as DepositResponse;
    return message;
  },

  toJSON(_: DepositResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<DepositResponse>): DepositResponse {
    const message = { ...baseDepositResponse } as DepositResponse;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /** this line is used by starport scaffolding # proto/tx/rpc */
  SendIBCMsg(request: DepositRequest): Promise<DepositResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  SendIBCMsg(request: DepositRequest): Promise<DepositResponse> {
    const data = DepositRequest.encode(request).finish();
    const promise = this.rpc.request(
      "crossdapp.gateway.Msg",
      "SendIBCMsg",
      data
    );
    return promise.then((data) => DepositResponse.decode(new Reader(data)));
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (let i = 0; i < arr.byteLength; ++i) {
    bin.push(String.fromCharCode(arr[i]));
  }
  return btoa(bin.join(""));
}

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
