import { Transaction, TransactionPrevResponse } from '@psychedelic/plug-inpage-provider/dist/src/Provider/interfaces';

import { CreateTransaction } from '.';

export namespace Batch {
  export enum State {
    Idle = 'idle',
    Running = 'running',
  }

  export type Execute = () => Promise<any>;

  export type Push = (transaction: Transaction) => Controller;

  export type GetTransactions = () => Transaction[];

  export type GetState = () => State;

  export interface Controller {
    execute: Execute;
    push: Push;
    getTransactions: GetTransactions;
    getState: GetState;
  }

  export enum DefaultHookState {
    Idle = 'idle',
    Done = 'done',
    Error = 'error',
  }

  export type HookState = {
    [key: number]: string;
  };

  export interface Hook<State> {
    execute: Batch.Execute;
    state: State | DefaultHookState;
    error: unknown;
  }

  export interface HookProps<Model> {
    transactions: {
      [key: string]: ReturnType<CreateTransaction<Model, Transaction>>;
    };
    handleRetry?: (
      error: unknown,
      prevResponses?: TransactionPrevResponse[]
    ) => Promise<boolean | { nextTxArgs: unknown }>;
  }
}