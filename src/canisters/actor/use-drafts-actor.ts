import { ENV } from 'src/config/env';
import { useActor, Identity } from '.';
import { idlFactory } from '../idl/drafts.did';
import { _SERVICE } from '../model/drafts.did';

export const useDraftsActor = (identity?: Identity) => {
  return useActor<_SERVICE>({
    identity: identity,
    canisterId: ENV.canisterIds.drafts,
    interfaceFactory: idlFactory,
  });
}