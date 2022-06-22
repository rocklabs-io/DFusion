import { ENV } from 'src/config/env';
import { idlFactory } from 'src/canisters/idl/dfusion.did.js';
import { DFusion } from 'src/canisters/model/dfusion.did';
import { useActor, Identity } from '.';

export const useDfusionActor = (identity?: Identity) => {
  return useActor<DFusion>({
    identity: identity,
    canisterId: ENV.canisterIds.dfusion,
    interfaceFactory: idlFactory,
  });
}