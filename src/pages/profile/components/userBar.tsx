import { useEffect, useState } from "react";
import { Badge, Button, Flex, Text, Circle, useToast } from "@chakra-ui/react"
import { UserExt } from "../../../canisters/model/dfusion.did"
import { shortPrincipal } from "src/utils/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { Principal } from "@dfinity/principal";
import Avatar from "boring-avatars";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch, usePlugStore } from "src/store";
import { IoMdLink } from "react-icons/io";
import { ICNSReverseController } from "@psychedelic/icns-js";

export const UserBar = ({ pid }: { pid: Principal }) => {

  const dfusionActor = useDfusionActor(Identity.caller ?? undefined);
  const [userExt, setUserExt] = useState<Array<UserExt>>([])
  const [ICNSReverseName, setICNSReverseName] = useState('')
  const { principalId } = usePlugStore()
  const { following } = useUserExtStore()
  const [followed, setFollowed] = useState(false)
  const dispatch = useAppDispatch()
  const controller = new ICNSReverseController()
  const toast = useToast()
  const [hover, setHover] = useState(false)

  useEffect(() => {
    dfusionActor && dfusionActor?.getUser(pid).then((res) => {
      if (res.length > 0) {
        setUserExt(res)
      }
    })
  }, [dfusionActor])

  useEffect(() => {
    setFollowed(following.some((e: any)=> e.toString() === pid.toString()))
  }, [following, pid])

  useEffect(() => {
    controller && controller.getReverseName(pid).then((res) => {
      setICNSReverseName(res)
    })
  }, [controller])

  const [followLoading, setFollowLoading] = useState(false)

  const handleFollow = () => {
    if (dfusionActor && principalId) {
      setFollowLoading(true)
      dfusionActor.follow(pid)
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
            res ? userExtAction.setFollow(pid) :
              userExtAction.setUnfollow(pid)
          )
        }).catch((err) => {
          console.error(err)
        }).finally(() => {
          setFollowLoading(false)
        })
    }
  }

  return <Flex bgColor='white'
    padding='20px'
    width='100%'
    boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
    maxW={620}
    margin='10px 0'
    borderRadius={20}>
    <Circle cursor='pointer'
      boxShadow='1px 1px 10px rgba(0, 0, 0, 0.2)'>
      <Avatar size={80}
        name={pid.toString()}
        variant='marble' />
    </Circle>
    <Flex flexDir='column'
      width='100%'
      marginLeft='20px' >
      <Flex flexGrow={1}
        justifyContent='space-between'>
        <Text fontWeight='bold'
          fontSize={24}
          cursor='pointer'
          marginBottom='10px'>
          {userExt[0]?.name[0] ?? 'Unnamed'}
        </Text>
        <Flex height='32px' alignItems='center'>
          {ICNSReverseName && <a href={"https://" + ICNSReverseName + ".host"}>
            <Circle size='30px'
              border='1.5px solid #2663FF'>
              <IoMdLink color="#2663FF" size='18px' />
            </Circle>
          </a>}
          &nbsp;&nbsp;
          <Button
            fontWeight='medium'
            colorScheme='regular'
            height='32px'
            width={100}
            disabled={followLoading}
            isLoading={followLoading}
            variant={followed ? 'outline' : 'solid'}
            hidden={pid.toString() === principalId}
            onMouseOverCapture={() => {
              setHover(true)
            }}
            onMouseOutCapture={() => {
              setHover(false)
            }}
            _hover={{
              bg: 'regular.400',
              color: 'white',
            }}
            onClick={() => {
              handleFollow()
            }}>
            {followed ? (hover ? 'Unfollow' : 'Following') : 'Follow'}
          </Button>
        </Flex>
      </Flex>
      <Badge textTransform='lowercase'
        borderRadius='10px'
        fontSize={14}
        fontWeight='regular'
        padding='0 10px'
        // opacity={0.6}
        height='fit-content'
        width='fit-content'>
        {shortPrincipal(pid.toString(), 5, 3)}
      </Badge>
      <Text fontSize={14}
        noOfLines={1}
        opacity={0.6}>
        {userExt[0]?.bio[0] ?? 'No Biography'}
      </Text>
    </Flex>
  </Flex>
}