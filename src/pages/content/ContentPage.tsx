import { Box, Spinner, Stack, Tag } from "degen";
import { Session } from "inspector";
import React, { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import Editor from "rich-markdown-editor";
import { getEntry, like, verifyConnectionAndAgent } from "../../canisters/utils";
import { shortPrincipal } from "../../canisters/utils";
import { getTimeString } from "../../canisters/utils";
import Avatar from "boring-avatars";
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
  const [title, setTitle] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [createTime, setTime] = useState<string>("");
  // get post content
  useEffect(() => {
    verifyConnectionAndAgent().then(res => {
      getEntry(entryId).then(res => {
        var npara = res[0].content.split('\n').length
        setCreator(shortPrincipal(res[0].creator.toText()))
        setTime(getTimeString(res[0].createAt))
        var titlestring = ""
        if(npara>0) {
          titlestring = res[0].content.split('\n')[0]
          setTitle(titlestring.replace('#', ""))
        }
        if (npara>1){
          setContent(res[0].content.replace(titlestring, ""))
        }
        // setTitle(titlestring)
        // setContent(res[0].content);
      })
    })
  }, [])

  return(
    <div className={styles.pageContent}>
      {/* <h1>content</h1> */}
        {title.length<=0
        ?
        <><Stack align="center">
          <Box padding="40"><Spinner size="large" color="accent" /></Box></Stack>
        </> 
        : 
        <>
          <Stack align="center">
            <h1 style={{width: "140%", textAlign: "center"}}>{title}</h1></Stack>
          <Stack direction="vertical">
          <Box width="full">
          <Stack direction="horizontal" align="center"><Avatar size={32} name={creator} variant="marble" />{creator}<Tag>{creator}</Tag> <Tag>{createTime}</Tag></Stack></Box>
            <Editor defaultValue="loading" value={content} readOnly={true}/>
          </Stack>
        </>
        }
      
    </div>
  )
}