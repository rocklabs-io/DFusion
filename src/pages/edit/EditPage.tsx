import React, { createRef, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Editor from "rich-markdown-editor";
import styles from "./EditPage.module.css"
import { light as lightTheme } from "./styles/theme";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useToast, Button, Box, Input, Textarea, Flex, Switch, Badge, Center, Text, useEditable, Spinner, Link } from "@chakra-ui/react";
import { useBatchHook, useCreateEntryBatch } from "src/batch";
import { Batch } from "src/batch/model";
import { Result_1 } from "src/canisters/model/dfusion.did";
import RichMarkdownEditor from "rich-markdown-editor";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch } from "src/store";
import { useDraftsActor } from "src/canisters/actor/use-drafts-actor";

const { NFTStorage } = require('nft.storage')

export const EditPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [nft, setNft] = useState(false)
  let navigate = useNavigate()
  const toast = useToast()
  const { drafts } = useUserExtStore()
  let { search } = useLocation();
  const draftsActor = useDraftsActor(Identity.caller ?? undefined)

  const query = new URLSearchParams(search);
  const dispatch = useAppDispatch()
  const [onDraft, setOnDraft] = useState(Number(query.get('onDraft')) ?? 0)

  // storage client
  const NFT_STORAGE_TOKEN = `${process.env.REACT_APP_IPFS_TOKEN}`
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

  useEffect(() => {
    // only execute in the beginning
    if (onDraft && drafts) {
      setTitle(drafts[onDraft.toString()]?.title)
      setContent(drafts[onDraft.toString()]?.content)
    }
  }, [onDraft, drafts])


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
        // delete draft 
        if (onDraft) {
          var tmp = { ...drafts }
          delete tmp[onDraft]
          dispatch(userExtAction.setDrafts(tmp))
          localStorage.setItem('dfusion_drafts', JSON.stringify(tmp))
          draftsActor?.deleteDraft(BigInt(onDraft)).then(() => {
            console.log('deleted')
          })
        }
        if (!nft) {
          toast({
            title: "Success",
            description: 'Entry has been published successfully.',
            status: "success",
            duration: 3000
          })
          navigate('/entry/' + result.ok.toString())
        } else {
          toast({
            title: "Success",
            description: 'Entry has been published and minted successfully.',
            status: "success",
            duration: 3000
          })
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

  const handleSaveDraft = () => {
    // edit existing draft or generate a random string as index
    // const rand = onDraft ?? 0
    // (Math.random() + 1).toString(36).substring(7)
    // update it
    setLoading(true);
    let draft = {
      id: BigInt(onDraft) ?? BigInt(0),
      title: title,
      content: content,
      time: BigInt(new Date().getTime())
    }
    // change the local state
    draftsActor?.setDraft(draft).then((res) => {
      if ('ok' in res) {
        const localDraft = {
          ...draft,
          id: Number(res.ok),
          time: Number(draft.time) * 1000000
        }
        const newDrafts = {
          ...drafts,
          [res.ok.toString()]: localDraft
        }
        console.log(localDraft.time)
        const jsonData = JSON.stringify(newDrafts)
        // get the new draft
        localStorage.setItem('dfusion_drafts', jsonData)
        dispatch(userExtAction.setDrafts(newDrafts))
        setOnDraft(Number(res.ok))
        toast({
          title: "Draft saved",
          description: 'Draft id: ' + res.ok.toString(),
          status: "success",
          duration: 3000
        })
      } else {
        toast({
          title: "Failed to save draft",
          description: '' + res.err ?? 'unknown reason.',
          status: "error",
          duration: 3000
        })
      }
    }).catch((e) => {
      console.error(e)
      setLoading(false)
    }).finally(() => {
      setLoading(false)
    })
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
          <Flex alignItems='center'>
            <Badge marginRight='8px'
              borderRadius={12}
              p='2px 8px'>
              {onDraft ? "Draft Mode" : "Create Mode"}
            </Badge>
            <Link fontSize={12}
              color='#2663FF'
              href="/drafts"
            >
              View All Drafts
            </Link>
          </Flex>
          <Flex>
            <Button onClick={handleSaveDraft}
              width='120px'
              borderRadius={10}
              marginRight='12px'
              colorScheme='regular'
              variant='outline'
              isLoading={loading}
              disabled={loading || !title || !(Object.keys(drafts!)?.length < 5)}>
              {!(Object.keys(drafts!)?.length < 5) ? 'Draft Limited' : 'Save Draft'}</Button>
            <Flex alignItems='center'
              border='1px solid #6993FF'
              borderRadius={12}>
              <Badge variant='solid'
                borderRadius={12}
                m='0 8px' pr='2' fontSize={14}
                colorScheme={nft ? 'regular' : 'gray'} >
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
                isLoading={loading}
                disabled={loading || !title}>
                Publish </Button>
            </Flex>
          </Flex>
        </Flex>
        {/* <Center borderRadius={10}
          bgColor='gray.200' h='49px'
          margin='20px 0'
          color='gray.400'
          fontSize={14}><i>
            You have not add a banner picture now
          </i></Center> */}
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
          value={drafts && onDraft ? drafts[onDraft]?.content : ''}
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