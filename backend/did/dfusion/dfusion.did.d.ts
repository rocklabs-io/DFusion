import type { Principal } from '@dfinity/principal';
export interface CreateEntryRequest {
  'title' : string,
  'content' : string,
  'cover' : [] | [string],
}
export interface DFusion {
  'addAuth' : (arg_0: Principal) => Promise<boolean>,
  'addControllerToBucket' : (
      arg_0: Principal,
      arg_1: Array<Principal>,
    ) => Promise<undefined>,
  'createEntry' : (arg_0: CreateEntryRequest) => Promise<Result_1>,
  'favor' : (arg_0: bigint) => Promise<Result_2>,
  'follow' : (arg_0: Principal) => Promise<boolean>,
  'getBucketInfo' : () => Promise<
      [Array<bigint>, Array<bigint>, Array<Principal>]
    >,
  'getBucketStableSize' : (arg_0: Principal) => Promise<bigint>,
  'getEntries' : (arg_0: number, arg_1: number) => Promise<Array<EntryDigest>>,
  'getEntry' : (arg_0: bigint) => Promise<Result_3>,
  'getUser' : (arg_0: Principal) => Promise<[] | [UserExt]>,
  'getUserEntries' : (arg_0: Principal) => Promise<Array<EntryDigest>>,
  'getUserFavorites' : (arg_0: Principal) => Promise<Array<EntryDigest>>,
  'getUserFollowingEntries' : (arg_0: Principal) => Promise<Array<EntryDigest>>,
  'like' : (arg_0: bigint) => Promise<Result_2>,
  'mintNFT' : (arg_0: bigint) => Promise<Result_1>,
  'removeAuth' : (arg_0: Principal) => Promise<boolean>,
  'setLimit' : (arg_0: SetConfigRequest) => Promise<boolean>,
  'setUserInfo' : (arg_0: SetUserRequest) => Promise<Result>,
}
export interface EntryDigest {
  'id' : bigint,
  'title' : string,
  'creator' : Principal,
  'deleted' : boolean,
  'createAt' : Time,
  'favorites' : Array<Principal>,
  'cover' : [] | [string],
  'likes' : Array<Principal>,
  'contentDigest' : string,
}
export interface EntryExt {
  'id' : bigint,
  'title' : string,
  'creator' : Principal,
  'deleted' : boolean,
  'content' : string,
  'createAt' : Time,
  'favorites' : Array<Principal>,
  'cover' : [] | [string],
  'likes' : Array<Principal>,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_2 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_3 = { 'ok' : EntryExt } |
  { 'err' : string };
export interface SetConfigRequest {
  'coverLimit' : [] | [bigint],
  'contentLimit' : [] | [bigint],
  'bioLimit' : [] | [bigint],
  'nameLimit' : [] | [bigint],
  'bucketLimit' : [] | [bigint],
  'titleLimit' : [] | [bigint],
  'digestLimit' : [] | [bigint],
}
export interface SetUserRequest {
  'bio' : [] | [string],
  'name' : [] | [string],
}
export type Time = bigint;
export interface UserExt {
  'id' : Principal,
  'bio' : [] | [string],
  'favorites' : Array<bigint>,
  'name' : [] | [string],
  'likes' : Array<bigint>,
  'entries' : Array<bigint>,
  'followers' : Array<Principal>,
  'following' : Array<Principal>,
}
export interface _SERVICE extends DFusion {}
