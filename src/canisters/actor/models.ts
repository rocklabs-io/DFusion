import { IDL } from '@dfinity/candid';
import {
  DFusion,
} from 'src/canisters/model/dfusion.did';
import { _SERVICE as Index } from '../model/index.did';
import { _SERVICE as Notify } from '../model/notification.did';

export type AppActors = DFusion
  | Index
  | Notify

export interface ActorRepository {
  createActor: <T extends AppActors>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ) => Promise<T>;
}

export type ActorProps = {
  identity?: Identity;
  canisterId?: string;
  interfaceFactory: IDL.InterfaceFactory;
};

export enum Identity  {
  anonymous,
  caller
}