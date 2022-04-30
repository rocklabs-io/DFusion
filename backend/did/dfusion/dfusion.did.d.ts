import type { Principal } from '@dfinity/principal';
export interface DFusion {
  'addAuth' : (arg_0: Principal) => Promise<boolean>,
  'addControllerToBucket' : (
      arg_0: Principal,
      arg_1: Array<Principal>,
    ) => Promise<undefined>,
  'createEntry' : (arg_0: string, arg_1: string) => Promise<Result_2>,
  'follow' : (arg_0: Principal) => Promise<boolean>,
  'getBucketInfo' : () => Promise<
      [Array<bigint>, Array<bigint>, Array<Principal>]
    >,
  'getBucketStableSize' : (arg_0: Principal) => Promise<bigint>,
  'getEntries' : (arg_0: number, arg_1: number) => Promise<Array<EntryDigest>>,
  'getEntry' : (arg_0: bigint) => Promise<Result_1>,
  'getUser' : (arg_0: Principal) => Promise<[] | [UserExt]>,
  'getUserEntries' : (arg_0: Principal) => Promise<Array<EntryDigest>>,
  'like' : (arg_0: bigint) => Promise<Result>,
  'removeAuth' : (arg_0: Principal) => Promise<boolean>,
  'setLimit' : (arg_0: SetConfigRequest) => Promise<boolean>,
  'setUserInfo' : (arg_0: SetUserRequest) => Promise<undefined>,
}
export interface EntryDigest {
  'id' : bigint,
  'title' : string,
  'creator' : Principal,
  'deleted' : boolean,
  'createAt' : Time,
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
  'likes' : Array<Principal>,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Result_1 = { 'ok' : EntryExt } |
  { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : string };
export interface SetConfigRequest {
  'contentLimit' : [] | [bigint],
  'bioLimit' : [] | [bigint],
  'nameLimit' : [] | [bigint],
  'bucketLimit' : [] | [bigint],
  'titleLimit' : [] | [bigint],
}
export interface SetUserRequest {
  'bio' : [] | [string],
  'name' : [] | [string],
}
export type Time = bigint;
export interface UserExt {
  'id' : Principal,
  'bio' : [] | [string],
  'name' : [] | [string],
  'likes' : Array<bigint>,
  'entries' : Array<bigint>,
  'followers' : Array<Principal>,
  'following' : Array<Principal>,
}
export interface _SERVICE extends DFusion {}
