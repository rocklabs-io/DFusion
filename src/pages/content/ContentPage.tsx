import { Box, Spinner, Stack } from "degen";
import { Session } from "inspector";
import React, { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import Editor from "rich-markdown-editor";
import { getEntry, like, verifyConnectionAndAgent } from "../../canisters/utils";
import styles from "./ContentPage.module.css"

type Entry = {
  content: string;
  creator: Principal;
  createAt: Number;
  likes: [Principal];
};

export const ContentPage: React.FC = () => {
  // @ts-ignore
  const entryId = parseInt(window.location.href.split("/").pop());
  // const [entry, setEntry] = useState<Entry>();
  const [content, setContent] = useState<string>("");

  // get post content
  useEffect(() => {
    verifyConnectionAndAgent().then(res => {
      getEntry(entryId).then(res => {
        setContent(res[0].content);
      })
    })
  }, [])

  return(
    <div className={styles.pageContent}>
      {/* <h1>content</h1> */}
      <Stack align="center" direction="vertical">{content.length<=0?<><Box padding="40"><Spinner size="large" color="accent" /></Box></> :
        <Editor defaultValue="loading" value={content} readOnly={true}/>}
      </Stack>
    </div>
  )
}