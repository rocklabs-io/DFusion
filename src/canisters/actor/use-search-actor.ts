import { ENV } from 'src/config/env';
import { useActor, Identity } from '.';
import { idlFactory } from '../idl/index.did';
import { _SERVICE } from '../model/index.did';

export const useSearchActor = (identity?: Identity) => {
  return useActor<_SERVICE>({
    identity: identity,
    canisterId: ENV.canisterIds.index,
    interfaceFactory: idlFactory,
  });
}