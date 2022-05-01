import type { Principal } from '@dfinity/principal';
export interface DFusion {
  'addAuth' : (arg_0: Principal) => Promise<boolean>,
  'createEntry' : (arg_0: string, arg_1: string) => Promise<Result_2>,
  'follow' : (arg_0: Principal) => Promise<boolean>,
  'getBucketInfo' : () => Promise<
      [Array<bigint>, Array<bigint>, Array<Principal>]
    >,
  'getBucketStableSize' : (arg_0: Principal) => Promise<bigint>,
  'getEntries' : (arg_0: number, arg_1: number) => Promise<
      Array<EntryDigestExt>
    >,
  'getEntry' : (arg_0: bigint) => Promise<Result_1>,
  'getUser' : (arg_0: Principal) => Promise<[] | [UserExt]>,
  'getUserEntries' : (arg_0: Principal) => Promise<Array<EntryDigestExt>>,
  'like' : (arg_0: bigint) => Promise<Result>,
  'removeAuth' : (arg_0: Principal) => Promise<boolean>,
  'setLimit' : (arg_0: [] | [bigint], arg_1: [] | [bigint]) => Promise<boolean>,
}
export interface EntryDigestExt {
  'id' : bigint,
  'title' : string,
  'creator' : Principal,
  'createAt' : Time,
  'likesNum' : bigint,
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
export type Time = bigint;
export interface UserExt {
  'id' : Principal,
  'likes' : Array<bigint>,
  'entries' : Array<bigint>,
  'followers' : Array<Principal>,
  'following' : Array<Principal>,
}
export interface _SERVICE extends DFusion {}
