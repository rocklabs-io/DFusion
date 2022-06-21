import { useMemo } from 'react';
import {
  useBatchHook,
} from '..';
import { Batch, TypeCreateEntry } from '../model';
import { useCreateEntryTransactionMemo } from '../transactions';

export enum CreateEntryModalDataStep {
  CreateEntry = 'createEntry',
}

export const useCreateEntryBatch = (props: TypeCreateEntry) => {

  const createTx = useCreateEntryTransactionMemo(props)

  const transactions = useMemo(() => {

    let transactions = {};
    transactions = {
      ...transactions,
      createEntry: createTx,
    };
    return transactions;
  }, [createTx]);

  console.log(transactions)

  return [
    useBatchHook({
      transactions,
      handleRetry: () => {
        return Promise.resolve(false);
      },
    }),
  ] as [Batch.Hook<CreateEntryModalDataStep>];
};
