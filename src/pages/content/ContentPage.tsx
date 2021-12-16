import { Stack } from "degen";
import { Session } from "inspector";
import React from "react";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { idlFactory } from "../../canisters/dfusion.did";
declare let window: any;

export const ContentPage: React.FC = () => {
  
  // get post content
  const getEntry = async (id: Number) => {
    const canisterId = "kqomr-yaaaa-aaaai-qbdzq-cai"
    const whitelist = [canisterId]
    const result = await window.ic.plug.isConnected();
    console.log("connected:", result)
    // if(!result) {
      // TODO: DO NOT request connect every time
      await window.ic.plug.requestConnect({
        whitelist: whitelist, 
      })
    // }

    const actor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    const entry = await actor.getEntry(id);
    console.log('entry: ', entry)
  }

  // like the post
  const like = async (id: Number) => {
    const canisterId = "kqomr-yaaaa-aaaai-qbdzq-cai"
    const whitelist = [canisterId]
    const result = await window.ic.plug.isConnected();
    console.log("connected:", result)
    // if(!result) {
      // TODO: DO NOT request connect every time
      await window.ic.plug.requestConnect({
        whitelist: whitelist, 
      })
    // }

    const actor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    const ret = await actor.like(id);
    console.log('ret: ', ret)
  }

  const content = getEntry(1)

  return(
    <Stack>
      
    </Stack>
  )
}