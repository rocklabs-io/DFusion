import { useEffect, useState } from "react";
import { Text, Box, Image, useToast, Spinner, Badge, Circle } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { useNavigate } from "react-router-dom";
import { getTimeString, parseMD, shortPrincipal } from "../../../utils/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { EntryDigest } from "src/canisters/model/dfusiondid";
import { Flex } from "@chakra-ui/react";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch } from "src/store";
import { RiRocket2Fill, RiRocket2Line } from "react-icons/ri";

export const PlazaDigest = ({ entry }: { entry: EntryDigest }) => {
  const navigate = useNavigate()
  const dfusionActor = useDfusionActor(Identity.caller ?? undefined);
  const toast = useToast()
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')

  // like operated state, dislike -1 , liked +1 
  const [opLike, setOpLike] = useState(0)
  // is like being processed
  const [liking, setLiking] = useState(false);
  // all liked entries id
  const { likes } = useUserExtStore();

  // update state from the store
  // useEffect(() => {
  //   setIsLiked(likes.includes(entry.id));
  // }, [likes])

  useEffect(() => {
    dfusionActor && dfusionActor.getUser(entry.creator).then((e) => {
      if (e.length > 0 && e[0]?.name && e[0]?.name.length > 0) {
        setName(e[0]?.name[0] as string)
      }
    })
  }, [dfusionActor])

  const handleLike = () => {
    if (!liking) {
      setLiking(true);
      dfusionActor?.like(entry.id).then(res => {
        if ('ok' in res) {
          toast({
            status: 'success',
            title: 'Success!',
            description: (res.ok ? 'Liked' : 'Unliked') + ' successfully',
            duration: 3000
          })
          if (res.ok) {
            setOpLike(opLike + 1)
            dispatch(userExtAction.setLike(
              entry.id
            ))
          } else {
            setOpLike(opLike - 1)
            dispatch(userExtAction.setUnlike(
              entry.id
            ))
          }
        } else {
          toast({
            status: 'error',
            title: 'Failed',
            description: 'Operation failed: ' + res.err,
            duration: 3000
          })
        }
      }).finally(() => {
        setLiking(false)
      })
    }
  }

  return (//<a href={} target="_blank" rel="noopener noreferrer">
    <Box className="mitem">
      <Flex className="mcontent"
        flexDir='column'
        bgColor='white'
        padding='20px'
        width='100%'
        height='fit-content'
        boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
        borderRadius={20}>
        <Flex marginBottom='10px' alignItems='center'>
          <Circle size='24px' cursor='pointer' 
            onClick={(e) => {
            e.stopPropagation()
            navigate('/profile/' + entry.creator.toText())
          }}>
            <Avatar name={entry.creator.toText()} variant='marble' />
          </Circle> &nbsp;&nbsp;
          <Text fontSize={16}>{name}</Text> &nbsp;&nbsp;
          <Badge textTransform='lowercase'
            borderRadius='10px'
            fontSize={14}
            fontWeight='regular'
            padding='0 10px'
            opacity={0.6}
            height='fit-content'
            width='fit-content'
            cursor='pointer'
            onClick={()=>{
              navigator.clipboard.writeText(entry.creator.toText())
            }} >
            {shortPrincipal(entry.creator.toText(), 5, 3)}
          </Badge>
        </Flex>
        <Box width='100%'
          height='fit-content'
          cursor='pointer'
          minH='20px'
          onClick={() => {
            window.open('/entry/' + Number(entry.id).toString(), '_blank')
          }}
        >
          <Text fontWeight='bold'
            fontSize={24}
            lineHeight="28px" >
            {entry.title.replaceAll('#', '')}
          </Text>
          <Text fontWeight='medium'
            fontSize={16}
            // noOfLines={[0, 1, 2, 3]}
            opacity={0.87}>
            {parseMD(entry.contentDigest)}
          </Text>
          {entry.cover?.length > 0
            &&
            <Image m='8px 0' width='100%'
              fit='cover'
              // borderRadius={10}
              alt="Image Lost"
              src={entry.cover[0]}
            />
          }
        </Box>
        <Flex alignItems='center'
          justifyContent='space-between'>
          <Badge textTransform='lowercase'
            borderRadius='10px'
            fontSize={14}
            fontWeight='regular'
            padding='0 10px'
            opacity={0.6}
            height='fit-content'
            width='fit-content'>
            {/* {shortPrincipal(principalId, 5, 3)} */}
            {getTimeString(entry.createAt)}
          </Badge>
          <Flex alignItems='center'>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {
              liking
                ?
                <Spinner size='xs' color="grey" />
                :
                (
                  likes.includes(entry.id)
                    ?
                    <RiRocket2Fill size={20}
                      cursor='pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike()
                      }}
                      color="regular" />
                    :
                    <RiRocket2Line size={20}
                      cursor='pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike()
                      }}
                      color="grey" />
                )
            }
            &nbsp;
            <Text color='grey'>
              {Number(entry.likes.length) + opLike}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>)
  // </a>
}
