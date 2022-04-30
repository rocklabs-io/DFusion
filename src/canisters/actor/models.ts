import { IDL } from '@dfinity/candid';
import {
  DFusion,
} from 'src/canisters/model/dfusiondid';

export type AppActors = DFusion
  


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