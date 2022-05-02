import { Box, Circle, Spinner, Stack, Tag } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Editor from "rich-markdown-editor";
import { shortPrincipal } from "../../canisters/utils";
import { getTimeString } from "../../canisters/utils";
import { Text } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import styles from "./ContentPage.module.css"
import { useDfusionActor } from "src/canisters/actor";
import { Principal } from "@dfinity/principal";
import { UserExt } from "src/canisters/model/dfusiondid";
import { useNavigate } from "react-router-dom";
import { ICNSReverseController } from "@psychedelic/icns-js";

export const ContentPage: React.FC = () => {
  // @ts-ignore
  const entryId = parseInt(window.location.href.split("/").pop());
  // const [entry, setEntry] = useState<Entry>();
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [createTime, setTime] = useState<string>("");
  const [creatorExt, setCreatorExt] = useState<UserExt | undefined>(undefined)
  const [ICNSName, setICNSName] = useState('')
  const dfusionActor = useDfusionActor(undefined)
  const icnsActor = new ICNSReverseController()
  const navigate = useNavigate()

  // get post content
  useEffect(() => {
    dfusionActor?.getEntry(BigInt(entryId)).then(res => {
      console.log(entryId)
      console.log(res)
      if ('ok' in res) {
        let entry = res['ok']
        console.log(entry.title)
        setCreator(entry.creator.toText() as string)
        setTime(getTimeString(entry.createAt))
        setTitle(entry.title ? entry.title.replace('#', "") : "Untitled")
        setContent(entry.content ? entry.content : "No content.")
      } else {
        setContent("Error")
      }
    })
  }, [dfusionActor])

  useEffect(() => {
    dfusionActor?.getUser(Principal.fromText(creator)).then((res) => {
      if (res.length > 0) {
        setCreatorExt(res[0])
      }
    })
  }, [creator])

  useEffect(() => {
    if (creator !== "aaaaa-aa") {
      try {
        icnsActor?.getReverseName(Principal.fromText(creator)).then(res => {
          console.log(res)
          setICNSName(res)
        })
      } catch (err) {

      }
    }
  }, [creator])

  return (
    <div className={styles.pageContent}>
      {/* <h1>content</h1> */}
      {title.length <= 0
        ?
        <><Stack align="center">
          <Spinner size="lg" margin='30vh' /></Stack>
        </>
        :
        <>
          <Text
            fontSize='4xl'
            fontWeight='bold'
            lineHeight='48px'
            textAlign='left'>
            {title}
          </Text>
          <br />
          <Stack direction='column' paddingBottom='80px'>
            <Box width="full" >
              <Stack direction='row' align="center">
                <Circle cursor='pointer'
                  onClick={() => { navigate('/profile/' + creator) }}>
                  <Avatar size={32} name={creator} variant="marble" />
                </Circle>
                <Text fontWeight='medium' fontSize='1xl'>{creatorExt?.name}</Text>
                <Tag> {ICNSName ? ICNSName : shortPrincipal(creator)} </Tag>
                <Tag>{createTime}</Tag>
              </Stack>
            </Box>
            <Editor defaultValue="loading" value={content} readOnly={true} />
          </Stack>
        </>
      }
    </div>
  )
}