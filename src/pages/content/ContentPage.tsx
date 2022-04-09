import { Box, Spinner, Stack, Tag } from "degen";
import { Session } from "inspector";
import React, { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import Editor from "rich-markdown-editor";
import { shortPrincipal } from "../../canisters/utils";
import { getTimeString } from "../../canisters/utils";
import { Text } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import styles from "./ContentPage.module.css"
import { useDfusionActor } from "src/canisters/actor";

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
  const dfusionActor = useDfusionActor(undefined)

  // get post content
  useEffect(() => {
    dfusionActor?.getEntry(BigInt(entryId)).then(res => {
      console.log(entryId)
      console.log(res)
      if ('ok' in res) {
        let entry = res['ok']
        console.log(entry.title)
        setCreator(shortPrincipal(entry.creator.toText()) as string)
        setTime(getTimeString(entry.createAt))
        setTitle(entry.title ? entry.title.replace('#', "") : "Untitled")
        setContent(entry.content ? entry.content : "No content.")
      } else {
        setContent("Error")
      }
    })
  }, [dfusionActor])

  return (
    <div className={styles.pageContent}>
      {/* <h1>content</h1> */}
      {title.length <= 0
        ?
        <><Stack align="center">
          <Box padding="40"><Spinner size="large" color="accent" /></Box></Stack>
        </>
        :
        <>
          <Stack align="center">
            <Text marginTop='5vh'
              fontSize='6xl' 
              fontWeight='bold' 
              textAlign='center'>
              {title}
            </Text>
          </Stack>
          <Stack direction="vertical">
            <Box width="full">
              <Stack direction="horizontal" align="center"><Avatar size={32} name={creator} variant="marble" />{creator}<Tag>{creator}</Tag> <Tag>{createTime}</Tag></Stack></Box>
            <Editor defaultValue="loading" value={content} readOnly={true} />
          </Stack>
        </>
      }

    </div>
  )
}