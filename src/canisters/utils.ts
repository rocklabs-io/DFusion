import { idlFactory } from "./model/dfusion.did";
import {
    Actor,
    HttpAgent,
  } from "@dfinity/agent";

  export const shortPrincipal = (
    principalId?: string,
    firstLength = 5,
    lastLength = 3
  ) => {
    if (principalId) {
      const firstPart = principalId.slice(0, firstLength);
      const secondPart = principalId.slice(
        principalId.length - lastLength,
        principalId.length
      );
  
      return `${firstPart}...${secondPart}`;
    }
  };

export const getTimeString = (t: bigint) => {
    var d = new Date(Math.floor(Number(t)/1000000));
    return d.toLocaleString(); //'en-US', { timeZone: 'UTC' }
}

const suffix = '.icp'

// _ - number character
export const addIcpSuffix = (name: string | undefined) => {
    if (typeof name === 'undefined') return;
    if (!name.endsWith(suffix))
      return name + suffix
    else
      return name
  
  }

const getReadActor = async () => {
    const agent = new HttpAgent({
        host: "https://boundary.ic0.app/",
    });
    return Actor.createActor(idlFactory, 
        {agent, canisterId: "kqomr-yaaaa-aaaai-qbdzq-cai"}
    );
}

// const getDFusionActor = async () => {
//     try {
//         // @ts-ignore
//         if(!window.ic?.plug?.agent) {
//             // @ts-ignore
//             await window.ic.plug.requestConnect({
//                 whitelist:["kqomr-yaaaa-aaaai-qbdzq-cai"]
//             });
//             // @ts-ignore
//             var principal = await window.ic.plug.agent.getPrincipal();
//             localStorage.setItem("principal", principal.toText());
//             localStorage.setItem("hasAgent", "true");
//         }
//         // @ts-ignore
//         return window.ic.plug.createActor({
//             canisterId: "kqomr-yaaaa-aaaai-qbdzq-cai",
//             interfaceFactory: idlFactory
//         })
//     } catch (e) {
//         console.log(e);
//         return await getReadActor();
//     }
// }

// export const verifyConnectionAndAgent = async () => {
//     try {
//         // @ts-ignore
//         const connected = await window.ic.plug.isConnected();
//         // @ts-ignore
//         // @ts-ignore
//         if (!connected) await window.ic.plug.requestConnect({
//             whitelist:["kqomr-yaaaa-aaaai-qbdzq-cai"]
//         });
//         // @ts-ignore
//         // @ts-ignore
//         if (connected && !window.ic.plug.agent) {
//             // @ts-ignore
//             await window.ic.plug.createAgent({
//                 whitelist:["kqomr-yaaaa-aaaai-qbdzq-cai"]
//             })
//         }
//         return true;
//     } catch (e) {
//         console.log(e);
//     }
// }

// export const getAllEntries = async () => {
//     const actor = await getDFusionActor();
//     return await actor.getAllEntries();
// }

// export const createEntry = async (content: string) => {
//     const actor = await getDFusionActor();
//     return await actor.createEntry(content);
// }

// export const getEntry = async (id: Number) => {
//     const actor = await getDFusionActor();
//     return await actor.getEntry(id);
// }

// export const getUser = async (user: string) => {
//     const actor = await getDFusionActor();
//     return await actor.getUser(Principal.fromText(user));
// }

// export const follow = async (user: string) => {
//     const actor = await getDFusionActor();
//     return await actor.follow(Principal.fromText(user));
// }

// export const like = async (user: string) => {
//     const actor = await getDFusionActor();
//     return await actor.like(Principal.fromText(user));
// }

// export const getUserEntries = async (user: string) => {
//     const actor = await getDFusionActor();
//     return await actor.getUserEntries(Principal.fromText(user));
// }
