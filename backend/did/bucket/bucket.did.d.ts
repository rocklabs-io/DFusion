import type { Principal } from '@dfinity/principal';
export interface Bucket {
  'createEntry' : (arg_0: EntryExt) => Promise<Result_2>,
  'getEntry' : (arg_0: bigint) => Promise<Result_1>,
  'getStableSize' : () => Promise<bigint>,
  'like' : (arg_0: bigint, arg_1: Principal) => Promise<Result>,
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
export interface _SERVICE extends Bucket {}
