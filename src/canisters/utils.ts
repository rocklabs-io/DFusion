import { Principal } from "@dfinity/principal";
import { idlFactory } from "./dfusion.did";


export const shortPrincipal = (principal: string) => `${principal.substr(0,8)}...${principal.substr(-4)}`

export const getTimeString = (t: bigint) => {

    var d = new Date(Number(t/BigInt(1000000)));
    return d.toLocaleString('en-GB', { timeZone: 'UTC' });
}

const getDFusionActor = async () => {
    // @ts-ignore
    return window.ic.plug.createActor({
        canisterId: "kqomr-yaaaa-aaaai-qbdzq-cai",
        interfaceFactory: idlFactory
    })
}

export const verifyConnectionAndAgent = async () => {
    // @ts-ignore
    const connected = await window.ic.plug.isConnected();
    // @ts-ignore
    // @ts-ignore
    if (!connected) await window.ic.plug.requestConnect({
        whitelist:["kqomr-yaaaa-aaaai-qbdzq-cai"]
    });
    // @ts-ignore
    // @ts-ignore
    if (connected && !window.ic.plug.agent) {
        // @ts-ignore
        await window.ic.plug.createAgent({
            whitelist:["kqomr-yaaaa-aaaai-qbdzq-cai"]
        })
    }
    return true;
}

export const getAllEntries = async () => {
    const actor = await getDFusionActor();
    return await actor.getAllEntries();
}

export const createEntry = async (content: string) => {
    const actor = await getDFusionActor();
    return await actor.createEntry(content);
}

export const getEntry = async (id: Number) => {
    const actor = await getDFusionActor();
    return await actor.getEntry(id);
}

export const getUser = async (user: string) => {
    const actor = await getDFusionActor();
    return await actor.getUser(Principal.fromText(user));
}

export const follow = async (user: string) => {
    const actor = await getDFusionActor();
    return await actor.follow(Principal.fromText(user));
}

export const like = async (user: string) => {
    const actor = await getDFusionActor();
    return await actor.like(Principal.fromText(user));
}

export const getUserEntries = async (user: string) => {
    const actor = await getDFusionActor();
    return await actor.getUserEntries(Principal.fromText(user));
}
