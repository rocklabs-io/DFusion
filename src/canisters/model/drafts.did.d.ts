import type { Principal } from '@dfinity/principal';
export interface Draft {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'time' : Time,
}
export interface Drafts {
  'addAuth' : (arg_0: Principal) => Promise<boolean>,
  'deleteDraft' : (arg_0: bigint) => Promise<Result>,
  'getUserDraft' : () => Promise<Array<Draft>>,
  'removeAuth' : (arg_0: Principal) => Promise<boolean>,
  'reset' : () => Promise<undefined>,
  'setDraft' : (arg_0: Draft) => Promise<Result>,
  'setLimit' : (arg_0: SetConfigRequest) => Promise<boolean>,
}
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export interface SetConfigRequest {
  'countLimit' : [] | [bigint],
  'contentLimit' : [] | [bigint],
  'titleLimit' : [] | [bigint],
}
export type Time = bigint;
export interface _SERVICE extends Drafts {}
