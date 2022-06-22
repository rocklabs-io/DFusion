import { Badge, Button, Flex, Text, Image, useToast, useDisclosure, PopoverCloseButton } from "@chakra-ui/react"
import { EntryDigest, Result_1 } from "../../../canisters/model/dfusion.did"
import { getTimeString } from "src/utils/utils";
import { useNavigate } from "react-router-dom";
import { parseMD } from "src/utils/utils";
import { useDfusionActor } from "src/canisters/actor";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger as OrigPopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react'
import { useMintNFTBatch } from "src/batch/mintNFT";
import { usePlugStore } from "src/store";

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

export const ProfileDigest = ({ entry }: { entry: EntryDigest }) => {
  const navigate = useNavigate()
  const actor = useDfusionActor()
  const [nft, setNft] = useState(false)
  const [loading, setLoading] = useState(true)
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { principalId } = usePlugStore()

  useEffect(() => {
    if (actor) {
      actor.isNFT([entry.id]).then((res) => {
        setNft(res[0])
        setLoading(false)
      })
    }
  }, [actor])

  const [batch] = useMintNFTBatch({
    entryId: entry.id
  })
  const toast = useToast()

  const handleMint = () => {
    if (batch && !loading) {
      setLoading(true)
      batch.execute()
        .then((res: Result_1) => {
          if ('ok' in res) {
            toast({
              title: "Success",
              description: 'NFT has been minted successfully.',
              status: "success",
              duration: 3000
            })
            setNft(true)
          } else {
            toast({
              title: "Failed",
              description: '' + res.err,
              status: "error",
              duration: 3000
            })
          }
        }).catch((err) => {
          toast({
            title: "Caught error",
            description: '' + err ?? 'unknown reason.',
            status: "error",
            duration: 3000
          })
        }).finally(() => {
          setLoading(false)
          onClose()
        })
    }
  }

  return <>
    <Flex flexDir='column'
      bgColor='white'
      padding='20px'
      width='100%'
      boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
      maxW={620}
      margin='20px 0'
      borderRadius={20}>
      <Text fontWeight='bold' fontSize={36} lineHeight='40px'>
        {entry.title}
      </Text>
      <Flex width='100%'
        align='center'
        justifyContent='space-between'>
        <Badge textTransform='lowercase'
          borderRadius='10px'
          fontSize={14}
          fontWeight='regular'
          margin='10px 0'
          padding='0 10px'
          opacity={0.6}
          width='fit-content'>
          {/* {shortPrincipal(principalId, 5, 3)} */}
          {getTimeString(entry.createAt)}
        </Badge>

        <Popover isOpen={(nft ||
          !principalId ||
          entry.creator.toString() !== principalId)
          ? false : isOpen}
          onOpen={onOpen}
          onClose={onClose}>
          <PopoverTrigger >
            <Badge variant='solid'
              borderRadius={12}
              height='fit-content'
              m='0 8px' pr='2' fontSize={14}
              colorScheme={nft ? 'regular' : 'gray'} >
              <i>NFT</i></Badge>
          </PopoverTrigger>
          <PopoverContent
            _focus={{ border: '1px solid gray.300' }}
            borderRadius={20}>
            <PopoverBody padding='20px'>
              <Text fontSize={16} fontWeight='bold'>Mint NFT</Text>
              <Text margin='20px 0'>
                Are you sure to mint this post to NFT?🤝
              </Text>
              <Flex justifyContent='flex-end'>
                <Button width='100px'
                  mr='1rem' borderRadius={8}
                  colorScheme='regular'
                  variant='outline'
                  onClick={() => {
                    onClose()
                  }}>
                  Cancel</Button>
                <Button width='100px'
                  colorScheme='regular'
                  borderRadius={8}
                  isLoading={loading}
                  disabled={loading}
                  onClick={() => {
                    handleMint()
                  }}
                >Confirm</Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>


      </Flex>
      <Text fontWeight='medium' fontSize={16} opacity={0.87}>
        {parseMD(entry.contentDigest)}
      </Text>
      {/* <Editor theme={lightTheme} readOnly value={entry.contentDigest.replace('\n', '')} /> */}
      {entry.cover?.length > 0
        &&
        <Image marginTop='20px'
          maxH={160}
          fit='cover'
          borderRadius={10}
          src={entry.cover[0]} />
      }
      <hr style={{ margin: '20px 0' }} />
      <Button color='regular.500'
        onClick={() => { navigate('/entry/' + entry.id) }}
      > Continue Reading
      </Button>
    </Flex>
    <hr />
  </>
}