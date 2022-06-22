import { useMemo } from 'react';
import {
  useBatchHook,
} from '..';
import { Batch } from '../model';
import { useMintNFTTransactionMemo } from '../transactions/mintNFT';

export enum MintNFTModalDataStep {
  mintNFT = 'Minting',
}

export const useMintNFTBatch = (props: {entryId: bigint}) => {

  const mintTx = useMintNFTTransactionMemo(props)

  const transactions = useMemo(() => {

    let transactions = {};
      transactions = {
        ...transactions, 
        mintNFT: mintTx,
      }
    
    return transactions;
  }, [mintTx]);

  return [
    useBatchHook({
      transactions,
      handleRetry: () => {
        return Promise.resolve(false);
      },
    }),
  ] as [Batch.Hook<MintNFTModalDataStep>];
};
