import { ENV } from 'src/config/env';
import { useActor, Identity } from '.';
import { idlFactory } from '../idl/notification.did';
import { _SERVICE } from '../model/notification.did';

export const useNotifyActor = (identity?: Identity) => {
  return useActor<_SERVICE>({
    identity: identity,
    canisterId: ENV.canisterIds.notify,
    interfaceFactory: idlFactory,
  });
}