import { Actor, HttpAgent, } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { ENV } from 'src/config/env';
import type { Provider } from '@psychedelic/plug-inpage-provider';
import { ActorRepository, AppActors, Identity } from './models';

export const appActors: Record<string, any> = {};
export const appAnonymousActors: Record<string, any> = {};

export class ActorAdapter implements ActorRepository {
  constructor(public provider: Provider) { }

  async createActor<T extends AppActors>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ): Promise<any> {
    if (appActors[canisterId] && appAnonymousActors[canisterId])
      return this.provider ? appActors[canisterId] : appAnonymousActors[canisterId]

    await this.createAgent();

    let actor;

    if (!this.provider) {
      // console.log('create actor from http')
      const agent = new HttpAgent({ host: ENV.host });

      actor = Actor.createActor<T>(interfaceFactory, {
        agent,
        canisterId,
      });
      appAnonymousActors[canisterId] = actor;
    } else {
      // console.log('create actor from plug')
      actor = await this.provider.createActor<T>({
        canisterId,
        interfaceFactory,
      } as any);
      appActors[canisterId] = actor;
    }
    return actor;
  }

  private async createAgent(): Promise<any> {
    if (this.provider && !this.provider?.agent) {
      await this.provider.createAgent({
        whitelist: Object.values(ENV.canisterIds),
        host: ENV.host,
      });
    }
  }
}
