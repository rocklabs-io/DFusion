import { ENV } from 'src/config/env';
import { idlReverseRegistrarFactory } from 'src/canisters/model/reverse_registrar.did';
import { ICNSReverseRegistrar } from 'src/canisters/model/reverse_registrardid';
import { useActor, Identity } from '.';

export const useReverseRegistrarActor = (identity?: Identity) => {
  return useActor<ICNSReverseRegistrar>({
    identity: identity,
    canisterId: ENV.canisterIds.reverse_registrar,
    interfaceFactory: idlReverseRegistrarFactory,
  });
}