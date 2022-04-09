import { useEffect, useState } from 'react';
import { usePlugStore } from 'src/store';
import { ActorAdapter } from './actor-adapter';
import { ActorProps, AppActors, Identity } from './models';

export const useActor = <T extends AppActors>(
  props: ActorProps
): T | undefined => {
  const [actor, setActor] = useState<T>();
  const { isConnected } = usePlugStore();

  useEffect(() => {
    setActor(undefined);
    if (!props.canisterId) return;
    new ActorAdapter(isConnected ? (props.identity === Identity.caller ? window.ic?.plug : undefined) : undefined)
      .createActor<T>(props.canisterId, props.interfaceFactory)
      .then((newActor) => setActor(newActor))
      .catch((error) => console.error(error));
  }, [isConnected, props.canisterId]);

  return actor;
};
