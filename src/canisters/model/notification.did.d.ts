import type { Principal } from '@dfinity/principal';
export type MessitySendResult = { 'ok' : null } |
  { 'err' : string };
export interface Notification {
  'getSubscribees' : (arg_0: Principal) => Promise<Array<Principal>>,
  'getSubscribers' : (arg_0: Principal) => Promise<Array<Principal>>,
  'isSubscribed' : (arg_0: Principal, arg_1: Principal) => Promise<boolean>,
  'notify' : (arg_0: NotifyRequest) => Promise<MessitySendResult>,
  'subscribe' : (arg_0: SubscribeRequest) => Promise<Result>,
}
export interface NotifyRequest {
  'id' : bigint,
  'title' : string,
  'authorName' : string,
  'author' : Principal,
  'contentDigest' : string,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export interface SubscribeRequest { 'subscribee' : Principal }
export interface _SERVICE extends Notification {}
