import { useMemo } from 'react';
import {
  useBatchHook,
} from '..';
import { Batch, TypeCreateEntry } from '../model';
import { useCreateEntryTransactionMemo } from '../transactions';
import { useMintNFTTransactionMemo } from '../transactions/mintNFT';

export enum CreateEntryModalDataStep {
  CreateEntry = 'createEntry',
}

export const useCreateEntryBatch = (props: TypeCreateEntry) => {

  const createTx = useCreateEntryTransactionMemo(props)
  const mintTx = useMintNFTTransactionMemo(props)

  const transactions = useMemo(() => {

    let transactions = {};

    transactions = {
      ...transactions,
      createEntry: createTx
    };
    if(props.mint){
      transactions = {
        ...transactions, 
        mintNFT: mintTx,
      }
    }
    return transactions;
  }, [createTx, mintTx, props.mint]);

  return [
    useBatchHook({
      transactions,
      handleRetry: () => {
        return Promise.resolve(false);
      },
    }),
  ] as [Batch.Hook<CreateEntryModalDataStep>];
};
