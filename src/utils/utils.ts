import { idlFactory } from "../canisters/idl/dfusion.did";
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

/**
 * extract plain text from markdown...
 */
export const parseMD = (raw: string) => {
  const htmlText = raw
		.replace(/^### (.*$)/gim, '$1') // title
		.replace(/^## (.*$)/gim, '$1')
		.replace(/^# (.*$)/gim, '$1')
		.replace(/^\`\`\` (.*$)/gim, '$1') // code
		.replace(/^\> (.*$)/gim, '$1') // quote
		.replace(/\*\*(.*)\*\*/gim, '$1') // bold
		.replace(/\*(.*)\*/gim, '$1')
		.replace(/!\[(.*?)\]\((.*?)\)/gim, "") // image
    .replace(/!\[(.*?)\]\((.*?)/gim, "") // half ~
    .replace(/!\[(.*?)/gim, "") //~
		.replace(/\[(.*?)\]\((.*?)\)/gim, "$1") // url
    .replace(/\[(.*?)\]\((.*?)/gim, "") // half ~
    .replace(/\[(.*?)/gim, "") //~
		.replace(/\\\n/gim, "") // remove newline
		.replace(/\n/gim, "") // remove newline
    .replace(/\s(\S*)$/gim, " ..." ) // remove remains
	return htmlText.trim()
}