import { IDL } from '@dfinity/candid';
import {
  DFusion,
} from 'src/canisters/model/dfusiondid';
import {
  ICNSReverseRegistrar
} from 'src/canisters/model/reverse_registrardid';

export type AppActors =
  ICNSReverseRegistrar  
  | DFusion
  


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