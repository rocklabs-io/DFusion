import { useMemo } from 'react';
import { CreateTransaction, TypeCreateEntry } from '../model';
import { idlFactory } from '../../canisters/model/dfusion.did'
import { ENV } from 'src/config/env';
import { Result_1 } from 'src/canisters/model/dfusiondid';

export const useCreateEntryTransactionMemo: 
CreateTransaction<TypeCreateEntry> = (
  { title, content },
  onSuccess,
  onFail
) => {
  return useMemo(() => {

    const coverLink = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g.exec(content)
    const cover = (coverLink?.length as number) > 1 ? [coverLink![1]] : []

    return {
      canisterId: ENV.canisterIds.dfusion,
      idl: idlFactory,
      methodName: 'createEntry',
      onSuccess: async (res: Result_1) => {
        if ('err' in res) throw new Error(JSON.stringify(res.err));
        if (onSuccess) onSuccess(res);
      },
      onFail,
      args: [{
        title: title,
        content: content,
        cover: cover
      }],
    };
  }, [title, content])
}
