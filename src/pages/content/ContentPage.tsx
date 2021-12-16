import { Stack } from "degen";
import { Session } from "inspector";
import React from "react";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { idlFactory } from "../../canisters/dfusion.did";
declare let window: any;

export const ContentPage: React.FC = () => {
  
  const getContent = async () => {
    const canisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai"
    const whitelist = [canisterId]
    await window.ic.plug.requestConnect({
      whitelist: whitelist, 
      host: 'http://localhost:8000'
    })

    const DRocksActor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    console.log(sessionStorage.getItem('identity'))
    const states = DRocksActor.getAllEntries()
    console.log('entries: ', states)

  }

  const content = getContent()

  return(
    <Stack>
      
    </Stack>
  )
}