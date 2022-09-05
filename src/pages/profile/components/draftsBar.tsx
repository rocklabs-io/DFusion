import React, { MouseEvent, useEffect, useState } from "react";
import { Badge, Flex, Text, useToast, Center, Icon, Spinner, Modal, ModalOverlay, useDisclosure, ModalContent, Button, ModalBody, ModalFooter, ModalHeader, ModalCloseButton } from "@chakra-ui/react"
import { getTimeString, parseMD } from "src/utils/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useNavigate, useParams } from "react-router-dom";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch, usePlugStore } from "src/store";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useDraftsActor } from "src/canisters/actor/use-drafts-actor";

export const DraftsBar = ({ item }: { item: string }) => {

  // const [followers, setFollowers] = useState<Array<Principal>>([])
  const { drafts } = useUserExtStore()
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [profileId, setProfileId] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const draftsActor = useDraftsActor(Identity.caller)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDelete = () => {
    if (!loading) {
      console.log('Delete Draft: ', drafts![item]?.id)
      setLoading(true)
      draftsActor?.deleteDraft(BigInt(drafts![item]?.id))
        .then((res) => {
          if ('ok' in res) {
            var tmp = { ...drafts }
            delete tmp[item]
            dispatch(userExtAction.setDrafts(tmp))
            localStorage.setItem('dfusion_drafts', JSON.stringify(tmp))
            toast({
              title: 'Draft deleted',
              status: 'success',
              duration: 3000
            })
          } else {
            toast({
              title: 'Failed to Delete Draft',
              description: '' + res.err,
              status: 'error',
              duration: 3000
            })
          }
        }).finally(() => {
          setLoading(false)
        })
    }
  }

  return <Flex padding='12px 18px' borderRadius={12}
    flexDir='column'
    marginTop='12px'
    cursor='pointer'
    boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
    key={item}
    onClick={() => {
      navigate('/edit?onDraft=' + item)
    }}>
    <Text fontWeight='medium' fontSize={20}>
      {drafts![item]?.title}
    </Text>
    <Text noOfLines={1} fontSize={14}>
      {parseMD(drafts![item]?.content)}
    </Text>
    <Flex justifyContent='space-between'
      alignItems='center'>
      <Badge textTransform='lowercase'
        borderRadius='10px'
        fontSize={14}
        fontWeight='regular'
        marginTop='8px'
        padding='0 10px'
        opacity={0.6}
        height='fit-content'
        width='fit-content'>
        {drafts![item].time ? getTimeString(BigInt(drafts![item]?.time as number)) : 'Unknown'}
      </Badge>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Warning</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you going to delete this draft?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='regular' variant='outline' mr={3}
              onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='regular'
              onClick={() => {
                onClose()
                handleDelete()
              }} >
              Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Icon as={loading ? Spinner : MdOutlineDeleteForever}
        color='red.400'
        _hover={{
          color: 'red.600'
        }}
        boxSize='20px'
        onClick={(e) => {
          e.stopPropagation()
          onOpen()
        }} />
    </Flex>
  </Flex>
}