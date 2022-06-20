import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Flex, Text, Circle, useToast, Skeleton, Center } from "@chakra-ui/react"
import { UserExt } from "../../canisters/model/dfusiondid"
import { shortPrincipal } from "src/canisters/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useNavigate, useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import Avatar from "boring-avatars";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch, usePlugStore } from "src/store";
import { IoMdLink } from "react-icons/io";
import { UserBar } from "./components";

export const FollowerPage: React.FC = () => {

  const dfusionActor = useDfusionActor(Identity.caller ?? undefined);
  const { pid } = useParams()
  const [valid, setValid] = useState(false)
  // const [followers, setFollowers] = useState<Array<Principal>>([])
  const [userExt, setUserExt] = useState<Array<UserExt>>([])
  const { following } = useUserExtStore()
  const { reverseName, principalId } = usePlugStore()
  const [loading, setLoading] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const toast = useToast()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [profileId, setProfileId] = useState('')

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

  const entriesArray = useMemo(() => {
    if (userExt?.length <= 0 || userExt[0].followers.length <= 0)
      return []
    else
      return userExt[0].followers.map((item, index) =>
        // <Digest entry={item} key={index} />
        <UserBar pid={item} key={index} />
      )
  }, [userExt])

  const handleFollow = () => {
    if (dfusionActor && principalId) {
      setFollowLoading(true)
      dfusionActor.follow(Principal.fromText(profileId as string))
        .then((res) => {
          if (res) {
            toast({
              title: 'Followed Successfully!',
              status: 'success',
              duration: 3000
            })
          } else {
            toast({
              title: 'Unfollowed',
              status: 'success',
              duration: 3000
            })
          }
          // modify followers list of target
          if (userExt.length > 0) {
            if (res) {
              var pfollowers = [...userExt[0].followers]
              pfollowers.push(Principal.fromText(principalId as string))
              setUserExt([{ ...userExt[0], followers: pfollowers }])
            } else {
              var pfollowers = [...userExt[0].followers]
              pfollowers = pfollowers.filter(
                value => value !== (Principal.fromText(principalId as string))
              )
              setUserExt([{ ...userExt[0], followers: pfollowers }])
            }
          }
          // modify your following list
          dispatch(
            res ? userExtAction.setFollow(Principal.fromText(profileId as string)) :
              userExtAction.setUnfollow(Principal.fromText(profileId as string))
          )
        }).catch((err) => {
          console.error(err)
        }).finally(() => {
          setFollowLoading(false)
        })
    }
  }

  return <Flex width='100%'
    paddingTop='88px'
    maxW={940}
    margin='0 auto'>
    <Flex flex='1' maxW={620} margin='10px 20px' flexDir='column'>
      <Text fontWeight='bold' lineHeight='28px' fontSize={24} >
        Followers
      </Text>
      {loading && <Skeleton margin='20px 0' width='620px' height='240px' borderRadius={20} />}
      {!loading && (entriesArray.length > 0 ?
        entriesArray.reverse() :
        <Center margin='20px 0'
          width='620px'
          height='240px'
          borderRadius={20}
          boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
        >
          <Text fontSize='2xl'>
            🥱 No Follower Yet
          </Text>
        </Center>)}
    </Flex>
    <Flex marginTop='48px'
      flexDir='column'>
      <Flex width='100%'
        minW={280}
        height='fit-content'
        padding='20px'
        marginBottom='20px'
        borderRadius='20px'
        backgroundColor='white'
        boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
        flexDirection='column'>
        <Flex width='100%'
          marginBottom='10px'
          justifyContent='space-between'>
          <Flex width='100%'
            flexDirection='column'
            justifyContent='space-between'>
            <Flex width='100%'
              marginBottom='20px'
              justifyContent='space-between'>
              <Avatar size={80}
                name={profileId}
                variant="marble" />
              <Flex height='32px' alignItems='center'>
                <a href={"https://" + reverseName + ".host"}>
                  <Circle size='30px'
                    border='1.5px solid #2663FF'>
                    <IoMdLink color="#2663FF" size='18px' />
                  </Circle>
                </a>&nbsp;&nbsp;
                <Button
                  fontWeight='medium'
                  colorScheme='regular'
                  height='32px'
                  disabled={followLoading}
                  isLoading={followLoading}
                  hidden={profileId === principalId}
                  onClick={() => {
                    handleFollow()
                  }}
                >
                  {following.some(e => e.toString() === profileId) ?
                    'Unfollow' : 'Follow'}
                </Button>
              </Flex>
            </Flex>
            <Text fontSize='24'
              lineHeight='28px'
              marginBottom='4px'
              fontWeight='bold'>
              {(userExt.length > 0 && userExt[0].name.length > 0 && userExt[0].name[0]) ?? 'Unnamed'}
            </Text>
            <Badge textTransform='lowercase'
              borderRadius='10px'
              fontSize='14px'
              marginBottom='12px'
              fontWeight='regular'
              padding='0 10px'
              width='fit-content'>
              {shortPrincipal(profileId, 5, 3)}
            </Badge>
            <Text opacity='0.8' fontSize='14px' fontWeight='bold' lineHeight='16px'>
              {/* {'1123'}&nbsp;
              <span style={{ fontWeight: 'normal', opacity: '0.6' }}>Following</span>&nbsp; */}
              {userExt.length > 0 ? userExt[0].followers.length : 0}&nbsp;
              <span style={{ fontWeight: 'normal', opacity: '0.6' }}>Follower</span>
            </Text>
          </Flex>
        </Flex>
        <Text fontSize={14} opacity='0.6'>
          {(userExt.length > 0 && userExt[0].bio.length > 0 && userExt[0].bio[0]) ?? 'No biography'}
        </Text>
      </Flex>
      <Button
        colorScheme='regular'
        onClick={() => {
          navigate('/setting')
        }}> Profile settings </Button>
    </Flex>

  </Flex>
}

export default FollowerPage;
