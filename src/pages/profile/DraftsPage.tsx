import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Flex, Text, Circle, useToast, Skeleton, Center, Icon } from "@chakra-ui/react"
import { UserExt } from "../../canisters/model/dfusion.did"
import { parseMD, shortPrincipal } from "src/utils/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useNavigate, useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import Avatar from "boring-avatars";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch, usePlugStore } from "src/store";
import { IoMdLink } from "react-icons/io";
import { UserBar } from "./components";
import { MdOutlineDeleteForever } from "react-icons/md";

export const DraftsPage: React.FC = () => {

  const dfusionActor = useDfusionActor(Identity.caller ?? undefined);
  const { pid } = useParams()
  const [valid, setValid] = useState(false)
  // const [followers, setFollowers] = useState<Array<Principal>>([])
  const [userExt, setUserExt] = useState<Array<UserExt>>([])
  const { drafts } = useUserExtStore()
  const { reverseName, principalId } = usePlugStore()
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [profileId, setProfileId] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    pid ?
      setProfileId(pid) :
      principalId ?
        setProfileId(principalId) :
        setProfileId('')
  }, [pid])

  useEffect(() => {
    try {
      dfusionActor && dfusionActor.getUser(Principal.fromText(profileId as string)).then((res: any) => {
        setUserExt(res)
      })
    } catch {
      setValid(false)
    }
  }, [dfusionActor, profileId])


  const draftsArray = useMemo(() => {
    if (drafts && Object.keys(drafts).length <= 0)
      return []
    else
      return drafts && Object.keys(drafts).map((item) =>
        <Flex padding='12px 18px' borderRadius={12}
          flexDir='column'
          marginTop='12px'
          cursor='pointer'
          boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
          key={item}
          onClick={() => {
            navigate('/edit?onDraft=' + item)
          }}>
          <Text fontWeight='medium' fontSize={20}>
            {drafts[item].title}
          </Text>
          <Text noOfLines={1} fontSize={14}>
            {parseMD(drafts[item].content)}
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
              {drafts[item].time ? new Date(drafts[item].time as number).toLocaleString() : 'Unknown'}
            </Badge>
            <Icon as={MdOutlineDeleteForever} 
              color='red.400'
              _hover={{
                color: 'red.600'
              }}
              boxSize='20px'
              onClick={(e)=>{
                e.stopPropagation()
                var tmp = {...drafts}
                delete tmp[item]
                dispatch(userExtAction.setDrafts(tmp))
                localStorage.setItem('dfusion_drafts', JSON.stringify(tmp))
              }}/>
          </Flex>
        </Flex>)
  }, [drafts])

  return <Flex width='100%'
    paddingTop='88px'
    maxW={940}
    margin='0 auto'>
    <Flex flex='1' maxW={620} margin='10px 20px' flexDir='column'>
      <Text fontWeight='bold' lineHeight='28px' fontSize={24} >
        Your Drafts
      </Text>
      <Text color='red.300'>
        These drafts are stored locally. <br />Please do not empty the browser cache and publish the article soon.
      </Text>
      {loading && <Skeleton margin='20px 0' width='620px' height='240px' borderRadius={20} />}
      {!loading && draftsArray && (draftsArray.length > 0 ?
        draftsArray?.reverse() :
        <Center margin='20px 0'
          width='620px'
          height='240px'
          borderRadius={20}
          boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
        >
          <Text fontSize='2xl'>
            🥱 No drafts found yet
          </Text>
        </Center>)}
    </Flex>
  </Flex >
}

export default DraftsPage;
