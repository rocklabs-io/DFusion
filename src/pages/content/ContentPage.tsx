import { Stack } from "degen";
import { Session } from "inspector";
import React, { useEffect } from "react";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import { getEntry, like, verifyConnectionAndAgent } from "../../canisters/utils";

export const ContentPage: React.FC = () => {
  
  // get post content
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