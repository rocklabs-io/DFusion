import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Flex, Text, Circle, useToast, Skeleton, Center, Icon } from "@chakra-ui/react"
import { UserExt } from "../../canisters/model/dfusion.did"
import { getTimeString, parseMD, shortPrincipal } from "src/utils/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useNavigate, useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import Avatar from "boring-avatars";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch, usePlugStore } from "src/store";
import { IoMdLink } from "react-icons/io";
import { DraftsBar } from "./components";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useDraftsActor } from "src/canisters/actor/use-drafts-actor";

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
  const draftsActor = useDraftsActor(Identity.caller)

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

  return <Flex width='100%'
    paddingTop=' 88px'
    maxW={940}
    margin='0 auto'>
    <Flex flex='1' maxW={620} margin='10px 20px' flexDir='column'>
      <Text fontWeight='bold' lineHeight='28px' fontSize={24} >
        Your Drafts
      </Text>
      <Text color='grey.300'>
        You can archive 5 drafts. <br />
      </Text>
      {loading && <Skeleton margin='20px 0' width='620px' height='240px' borderRadius={20} />}
      {!loading && drafts && ( Object.keys(drafts).length > 0 ?
        Object.keys(drafts).reverse().map((item) => 
        <DraftsBar item = {item} />)
      :
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
