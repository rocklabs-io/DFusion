import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Flex, Text, Circle, useToast, Skeleton, Center } from "@chakra-ui/react"
import { EntryDigest, UserExt } from "../../canisters/model/dfusion.did"
import { shortPrincipal } from "src/utils/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useNavigate, useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import Avatar from "boring-avatars";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { FeatureState, useAppDispatch, usePlugStore } from "src/store";
import { IoMdLink } from "react-icons/io";
import { ProfileDigest } from "./components/digest";
import { ICNSResolverController, ICNSReverseController } from "@psychedelic/icns-js";
import { useNotifyActor } from "src/canisters/actor/use-notify-actor";

export const ProfilePage: React.FC = () => {

  const dfusionActor = useDfusionActor(Identity.caller ?? undefined);
  const { pid } = useParams()
  const [valid, setValid] = useState(false)
  const [entries, setEntries] = useState<Array<EntryDigest>>([])
  const [userExt, setUserExt] = useState<Array<UserExt>>([])
  const { following,
    subscribees,
    userExtState,
    subscribeesState } = useUserExtStore()
  const { principalId } = usePlugStore()
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  const toast = useToast()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [profileId, setProfileId] = useState('')

  /**
   * check pid 
   */
  useEffect(() => {
    try {
      pid ?
        (
          Principal.fromText(pid)
          && setProfileId(pid)
        ) :
        principalId ?
          setProfileId(principalId) :
          setProfileId('')
    } catch (error) {
      setValid(false)
    }
  }, [pid])

  useEffect(()=>{
    if (!valid){}
      // toastError(false, 'Invalid User Profile Url')
  }, [valid])

  /**
   * get all entries
   */
  useEffect(() => {
    try {
      profileId && dfusionActor &&
        dfusionActor.getUserEntries(Principal.fromText(profileId as string)).then((res: Array<EntryDigest>) => {
          if (res.length !== entries.length) {
            setEntries(res)
          }
        }).finally(() => {
          setLoading(false)
        })
    } catch {
      setValid(false)
    }
  }, [dfusionActor, profileId])

  /**
   * get all info 
   */
  useEffect(() => {
    try {
      dfusionActor && dfusionActor.getUser(Principal.fromText(profileId as string)).then((res: any) => {
        if (res.length > 0) {
          setUserExt(res)
        } else {
          setValid(false)
        }
      })
    } catch {
      setValid(false)
    }
  }, [dfusionActor, profileId])

  const [icnsName, setIcnsName] = useState('')
  const [icnsHost, setIcnsHost] = useState('')

  const reverseController = new ICNSReverseController()
  const resolverController = new ICNSResolverController()

  useEffect(() => {
    if (reverseController && profileId) {
      reverseController.getReverseName(Principal.fromText(profileId)).then((res) => {
        res && setIcnsName(res)
      }).catch((err) => {
        console.log('No reversename')
      })
    }
  }, [reverseController, profileId])

  useEffect(() => {
    if (resolverController && icnsName) {
      resolverController.getHost(icnsName).then((res) => {
        if (typeof (res) === 'string') {
          setIcnsHost(res)
        }
      }).catch((err) => {
        console.log('No host found for this name: ', err)
      })
    }
  }, [resolverController, icnsName])



  const entriesArray = useMemo(() => entries.map((item, index) =>
    <ProfileDigest entry={item} key={index} />
  ), [entries])

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

  const [subscribing, setSubsrcibing] = useState(false)
  const notifyActor = useNotifyActor(Identity.caller)

  const handleSubscribe = () => {
    if (notifyActor) {
      setSubsrcibing(true)
      notifyActor.subscribe({
        "subscribee": Principal.fromText(profileId)
      }).then(res => {
        if ('ok' in res) {
          toastError(true, 'You have '
            + res.ok ? '' : 'un'
          + 'subscribed successfully!')
          dispatch(userExtAction.setSubscribees(
            res.ok ?
              (subscribees as string[]).concat([profileId]) :
              (subscribees as string[]).filter(item => item !== profileId)
          ))
          setSubsrcibing(false)
        } else {
          toastError(false, res.err.toString())
        }
      }).catch((err) => {
        toastError(false, err.toString())
      })
    }
  }

  const toastError = (status: boolean, txt: string) => {
    toast({
      title: status ? 'Success' : 'Failed',
      description: txt,
      duration: 3000,
      status: status ? 'success' : 'error',
    })
  }

  return <Flex width='100%'
    paddingTop='88px'
    maxW={940}
    margin='0 auto'>
    <Flex flex='1' maxW={620} margin='0 20px' flexDir='column'>
      <Text fontWeight='bold' lineHeight='28px' fontSize={24} > Posts </Text>
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
            🥱 No Posts Yet
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
                {
                  icnsHost ?
                    <a href={"https://" + icnsName + ".host"}>
                      <Circle size='30px'
                        border='1.5px solid #2663FF'>
                        <IoMdLink color="#2663FF" size='18px' />
                      </Circle>
                    </a> : ''
                }
                &nbsp;
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
                  {following.some((e: any) => e.toString() === profileId) ?
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
              <span style={{ fontWeight: 'normal', opacity: '0.6' }} onClick={() => { navigate('/follower/' + profileId) }}>Follower</span>
            </Text>
          </Flex>
        </Flex>
        <Text fontSize={14} opacity='0.6'>
          {(userExt.length > 0 && userExt[0].bio.length > 0 && userExt[0].bio[0]) ?? 'No biography'}
        </Text>
      </Flex>

      <Skeleton width='100%'
        borderRadius={16}
        isLoaded={!loading && subscribeesState === FeatureState.Idle}>
        {
          profileId === principalId ?
            <Button colorScheme='regular'
              onClick={() => {
                navigate('/setting')
              }}> Profile settings
            </Button> :
            <Button variant='outline'
              colorScheme='regular'
              width='100%'
              isLoading={subscribing}
              disabled={loading || subscribing}
              onClick={() => {
                handleSubscribe()
              }} >
              {subscribees?.includes(profileId) ?
                "Unsubscribe" :
                "Subscribe by DBOX"
              }</Button>
        }
      </Skeleton>

    </Flex>

  </Flex>
}

export default ProfilePage;

