// import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { Transaction } from "@psychedelic/plug-inpage-provider/dist/src/Provider/interfaces";

export type CreateTransaction<M, T extends Transaction = any, A = any> = (
  model: M,
  onSuccess?: T['onSuccess'],
  onFail?: T['onFail'],
  extraArgs?: A
) => T;
