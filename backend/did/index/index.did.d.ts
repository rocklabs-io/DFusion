import type { Principal } from '@dfinity/principal';
export interface SearchResult {
  'id' : bigint,
  'title' : string,
  'score' : number,
}
export interface _SERVICE {
  'add' : (arg_0: bigint, arg_1: string, arg_2: string) => Promise<undefined>,
  'search' : (arg_0: string) => Promise<Array<SearchResult>>,
}
