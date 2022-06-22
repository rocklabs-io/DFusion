import { useMemo, useState } from 'react';
import { CreateTransaction, TypeCreateEntry } from '../model';
import { idlFactory } from '../../canisters/idl/dfusion.did'
import { ENV } from 'src/config/env';
import { Result_1 } from 'src/canisters/model/dfusion.did';
import { TransactionPrevResponse } from '@psychedelic/plug-inpage-provider/dist/src/Provider/interfaces';
import { useNavigate } from 'react-router-dom';

export const useMintNFTTransactionMemo:
  CreateTransaction<{ entryId?: bigint }> = (
    { entryId },
    onSuccess,
    onFail
  ) => {
    const navigate = useNavigate()
    return useMemo(() => {
      return {
        canisterId: ENV.canisterIds.dfusion,
        idl: idlFactory,
        methodName: 'mintNFT',
        onSuccess: async (res: Result_1,
          responses: TransactionPrevResponse[]) => {
          console.log('prev in on Success: ', responses)
          if ('err' in res) throw new Error(JSON.stringify(res.err));
          if (onSuccess) onSuccess(res);
        },
        onFail,
        args: entryId ? [entryId] : (responses: TransactionPrevResponse[]) => {
          navigate('/entry/' + responses[0].response.ok.toString())
          return [responses[0].response.ok]
        }
      };
    }, [entryId])
  }
