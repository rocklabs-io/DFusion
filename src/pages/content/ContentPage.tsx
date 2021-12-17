import { Stack } from "degen";
import { Session } from "inspector";
import React, { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import Editor from "rich-markdown-editor";
import { getEntry, like, verifyConnectionAndAgent } from "../../canisters/utils";

type Entry = {
  content: string;
  creator: Principal;
  createAt: Number;
  likes: [Principal];
};

export const ContentPage: React.FC = () => {
  // @ts-ignore
  const entryId = parseInt(window.location.href.split("/").pop());

  const [entry, setEntry] = useState<Entry>();
  const [content, setContent] = useState<string>("Hello world");
  // var content = "hello";

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
      getEntry(entryId).then(res => {
        console.log(res);
        setEntry(res);
        setContent(res.content);
      })
    })
  }, [entry, content])

  return(
    <Stack>
      <Editor defaultValue={entry?.content}  />
    </Stack>
  )
}