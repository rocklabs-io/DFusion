import Provider from '@psychedelic/plug-inpage-provider';
import { Transaction, TransactionPrevResponse } from '@psychedelic/plug-inpage-provider/dist/src/Provider/interfaces';

import { Batch } from './model'

export class BatchTransactions implements Batch.Controller {
  private transactions: Transaction[] = [];
  private state: Batch.State = Batch.State.Idle;
  private batchTransactionResolver?: (value: unknown) => void;
  private batchTransactionRejector?: (value: unknown) => void;

  constructor(
    private provider?: Provider,
    private handleRetry?: (error: unknown) => Promise<boolean>
  ) {}

  public push(transaction: Transaction): BatchTransactions {
    this.transactions.push({
      ...transaction,
      onSuccess: (response) =>
        this.handleTransactionSuccess(transaction, response),
      onFail: (error, prevResponses) =>
        this.handleTransactionFail(transaction, error, prevResponses),
    });
    return this;
  }

  public async execute(): Promise<unknown> {
    if (this.state !== Batch.State.Idle) {
      // console.log('not idle')
      return Promise.reject(Batch.State.Running);
    }

    if (this.transactions.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.state = Batch.State.Running;
      this.batchTransactionResolver = resolve;
      this.batchTransactionRejector = reject;
      this.start();
    });
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getState(): Batch.State {
    return this.state;
  }

  private async handleTransactionSuccess(
    transaction: Transaction,
    responses: unknown[]
  ): Promise<unknown> {
    const result = await transaction.onSuccess(responses);
    this.pop();
    if (this.transactions.length === 0) {
      this.finishPromise(true, responses);
    } else {
    }
    return result;
  }

  private async handleTransactionFail(
    transaction: Transaction,
    error: unknown,
    prevResponses?: TransactionPrevResponse[]
  ): Promise<void> {
    const retry = this.handleRetry && (await this.handleRetry(error));
    if (retry) {
      this.start();
    } else {
      await transaction.onFail(error, prevResponses);
      this.finishPromise(false, error);
    }
  }

  private pop(): void {
    this.transactions = this.transactions.slice(1);
  }

  private finishPromise(resolved: boolean, result: unknown): void {
    if (!this.batchTransactionRejector || !this.batchTransactionResolver) {
      throw new Error('Batch not ready');
    }

    if (resolved) {
      this.batchTransactionResolver(result);
    } else {
      this.batchTransactionRejector(result);
    }
    this.batchTransactionResolver = undefined;
    this.batchTransactionRejector = undefined;
    this.state = Batch.State.Idle;
  }

  private start(): void {
    this.provider?.batchTransactions(this.transactions).catch((error:any) => {
      if (this.handleRetry) {
        return this.handleRetry(error).then((response) => {
          if (response) {
            return this.start();
          } else {
            this.finishPromise(false, error);
          }
        });
      } else {
        this.finishPromise(false, error);
      }
    });
  }
}
