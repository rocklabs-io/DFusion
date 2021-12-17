import { Stack } from "degen";
import { Session } from "inspector";
import React, { useEffect } from "react";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { getEntry, like, verifyConnectionAndAgent } from "../../canisters/utils";

export const ContentPage: React.FC = () => {
  
  // get post content

  // const getEntry = async (id: Number) => {
  //   const canisterId = "kqomr-yaaaa-aaaai-qbdzq-cai"
  //   const whitelist = [canisterId]
  //   const result = await window.ic.plug.isConnected();
  //   console.log("connected:", result)
  //   // if(!result) {
  //     // TODO: DO NOT request connect every time
  //     await window.ic.plug.requestConnect({
  //       whitelist: whitelist,

  useEffect(() => {
    verifyConnectionAndAgent().then(res => {
      getEntry(3).then(res => {
        console.log(res);
      })
    })
  })

  return(
    <Stack>
      
    </Stack>
  )
}