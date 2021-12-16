import { Stack } from "degen";
import { Session } from "inspector";
import React from "react";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { idlFactory } from "../../canisters/dfusion.did";
declare let window: any;

export const ContentPage: React.FC = () => {
  
  const getContent = async () => {
    const canisterId = "kqomr-yaaaa-aaaai-qbdzq-cai"
    const whitelist = [canisterId]
    // TODO: DO NOT request connect every time
    await window.ic.plug.requestConnect({
      whitelist: whitelist, 
    })

    const actor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    console.log(sessionStorage.getItem('identity'))
    const states = await actor.getAllEntries()
    console.log('entries: ', states)
  }

  const content = getContent()

  return(
    <Stack>
      
    </Stack>
  )
}