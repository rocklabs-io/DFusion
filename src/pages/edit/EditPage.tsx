import React, { useMemo } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "rich-markdown-editor";
import styles from "./EditPage.module.css"
import { light as lightTheme } from "./styles/theme";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useToast, Button, Box, Input, Textarea, Flex } from "@chakra-ui/react";
import { useBatchHook, useCreateEntryBatch } from "src/batch";
import { Batch } from "src/batch/model";
import { Result_1 } from "src/canisters/model/dfusiondid";
// import { NFTStorage } from "nft.storage";
const { NFTStorage } = require('nft.storage')

export const EditPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
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

const [batch] = useCreateEntryBatch({
  title: title,
  content: content
})

const handleSubmit = async () => {
  setLoading(true);
  batch.execute().then((result: Result_1) => {
    if (!result || 'err' in result) {
      toast({
        title: "Fail",
        description: '' + result?.err ?? 'unknown reason.',
        status: "error",
        duration: 3000
      })
    }
    if ('ok' in result!) {
      toast({
        title: "Success",
        description: 'Entry was published successfully.',
        status: "success",
        duration: 3000
      })
      navigate('/entry/' + result.ok?.toString());
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

return (
  <>
    <Flex width='100%'
      flexDir='column'
      maxWidth='800px'
      margin='0 auto'
      minHeight='100%'
      padding='100px 0'
      fontSize='25'>
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
      <Flex mt='20px'
        alignItems='flex-end'
        flexGrow={1} >
        <Button onClick={handleSubmit}
          colorScheme='regular'
          isLoading={loading}
          disabled={loading}> Publish </Button>
      </Flex>
    </Flex>
  </>)
}