import type { Principal } from '@dfinity/principal';
export interface Bucket {
  'createEntry' : (arg_0: EntryExt) => Promise<Result_1>,
  'getEntry' : (arg_0: bigint) => Promise<Result>,
  'getStableSize' : () => Promise<bigint>,
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
export type Result = { 'ok' : EntryExt } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE extends Bucket {}
