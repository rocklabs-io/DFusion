import React, { createRef, useMemo, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "rich-markdown-editor";
import styles from "./EditPage.module.css"
import { light as lightTheme } from "./styles/theme";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useToast, Button, Box, Input, Textarea, Flex, Switch, Badge, Center } from "@chakra-ui/react";
import { useBatchHook, useCreateEntryBatch } from "src/batch";
import { Batch } from "src/batch/model";
import { Result_1 } from "src/canisters/model/dfusiondid";
import RichMarkdownEditor from "rich-markdown-editor";
// import { NFTStorage } from "nft.storage";
const { NFTStorage } = require('nft.storage')

export const EditPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [nft, setNft] = useState(false)
  let navigate = useNavigate()
  const toast = useToast()
  const dfusionActor = useDfusionActor(Identity.caller)

  // storage client
  const NFT_STORAGE_TOKEN = `${process.env.REACT_APP_IPFS_TOKEN}`
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
  const uploadCar = async (img: File) => {
    // // convert image to blob
    const { car } = await NFTStorage.encodeBlob(img)
    const cid = await client.storeCar(car)
    console.log(cid)
    return 'https://nftstorage.link/ipfs/' + cid
  }

  const [createEntrybatch] = useCreateEntryBatch({
    title: title,
    content: content,
    mint: nft
  })

  const handlePublish = async () => {
    setLoading(true);
    createEntrybatch.execute().then((result: Result_1) => {
      if (!result || 'err' in result) {
        toast({
          title: "Fail",
          description: '' + result?.err ?? 'unknown reason.',
          status: "error",
          duration: 3000
        })
      } else if ('ok' in result!) {
        toast({
          title: "Success",
          description: 'Entry was published successfully.',
          status: "success",
          duration: 3000
        })
        if (!nft) {
          navigate('/entry/'+result.ok.toString())
        }
      }
    }).finally(() => {
      setLoading(false)
    }).catch(err => {
      toast({
        title: "Caught error",
        description: '' + err ?? 'unknown reason.',
        status: "error",
        duration: 3000
      })
    })
  }

  const onChange = async (txt: string) => {
    setContent(txt)
  }

  const edit = useRef<RichMarkdownEditor>(null)

  return (
    <>
      <Flex width='100%'
        flexDir='column'
        maxWidth='800px'
        margin='0 auto'
        minHeight='100%'
        padding='100px 0'
        fontSize='25'>
        <Flex alignItems='center'
          width='100%'
          justifyContent='space-between'>
          <Button colorScheme='regular'
            variant='outline'>
            Upload banner
          </Button>
          <Flex alignItems='center'
            border='1px solid #6993FF'
            borderRadius={12}>
            <Badge variant='solid' borderRadius={12}
              m='0 8px' pr='2' fontSize={14}
              colorScheme='regular'>
              <i>NFT</i></Badge>
            <Switch size='md'
              mr='10px'
              checked={nft}
              disabled={loading}
              onChange={() => {
                setNft(!nft)
              }}
              colorScheme='regular' />
            <Button onClick={handlePublish}
              width='120px'
              borderRadius={10}
              colorScheme='regular'
              loadingText={
                createEntrybatch.state+'...'
              }
              isLoading={loading}
              disabled={loading || !title}>
              Publish </Button>
          </Flex>
        </Flex>
        <Center borderRadius={10}
          bgColor='gray.200' h='49px'
          margin='20px 0'
          color='gray.400'
          fontSize={14}><i>
            You have not add a banner picture now
          </i></Center>
        <Textarea placeholder="Give me a title!"
          rows={1}
          height='70px'
          border='0'
          paddingInline='0'
          fontWeight='medium'
          fontSize='4xl'
          resize='none'
          overflow='hidden'
          value={title}
          onReset={(e) => {
            e.currentTarget.style.height = ""
            e.currentTarget.style.height = (e.currentTarget.scrollHeight + 5).toString() + 'px'
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              edit.current && edit.current.focusAtStart()
            }
          }}
          onChange={(e) => {
            e.target.style.height = ""
            e.target.style.height = (e.target.scrollHeight).toString() + 'px'
            setTitle(e.target.value)
          }}
          _focus={{
            border: 'none',
          }}
        ></Textarea>
        <Editor
          ref={edit as any}
          theme={lightTheme}
          className={styles.editor}
          onChange={(value) => onChange(value())}
          placeholder={'Hello creator! Write something here.'}
          onImageUploadStart={() => {
            toast({
              title: 'start upload',
              duration: 3000,
            })
          }}
          onImageUploadStop={() => {
            toast({
              title: 'upload stoped',
              duration: 3000,
            })
          }}
          uploadImage={async file => {
            return uploadCar(file)
          }} />

      </Flex>
    </>)
}