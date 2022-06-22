import { Principal } from '@dfinity/principal';

export type TypeCreateEntry = {
  title: string;
  content: string;
  cover?: string;
  mint?: boolean;
  entryId?: bigint;
}
