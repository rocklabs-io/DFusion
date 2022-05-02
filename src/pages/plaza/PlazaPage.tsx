import React, { useEffect, useState } from "react";
import { Stack, Heading, Text, Box, Tag, Image, Skeleton, useToast, Spinner, Badge, Circle } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { useNavigate } from "react-router-dom";
import { getTimeString, shortPrincipal } from "../../canisters/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { EntryDigest } from "src/canisters/model/dfusiondid";
import { Flex } from "@chakra-ui/react";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch } from "src/store";
import { Digest } from "../profile";

// element
const EntryElement = ({ article }: { article: EntryDigest }) => {
  var index = Number(article.id)
  let navigate = useNavigate()
  // procss article props
  var creator = shortPrincipal(article.creator.toText())
  var time = getTimeString(article.createAt)
  const dfusionActor = useDfusionActor(Identity.caller ?? undefined);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [liking, setLiking] = useState(false);

  // state: if this passage is liked by the user
  const [isLiked, setIsLiked] = useState(false);

  // all liked entries id
  const { likes } = useUserExtStore();

  const handleLike = () => {
    setLiking(true);
    dfusionActor?.like(article.id).then(res => {
      if ('ok' in res) {
        toast({
          status: 'success',
          title: 'Success!',
          description: (res.ok ? 'Liked' : 'Unliked') + ' successfully',
          duration: 3000
        })
        res.ok ?
          dispatch(userExtAction.setLike(
            article.id
          )) :
          dispatch(userExtAction.setUnlike(
            article.id
          ))
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

  // update state from the store
  useEffect(() => {
    setIsLiked(likes.includes(article.id));
  }, [likes])

  return (
    <Stack align='center' width='100%'>
      <Box borderBottomWidth="0.5"
        width="100%"
        borderColor='foregroundSecondary'
        padding="5">
        <Flex align="center">
          <Avatar size={32} name={creator} variant="marble" />
          &nbsp; &nbsp;
          {creator}
          &nbsp; &nbsp;
          <Tag>{creator}</Tag>
        </Flex>
        <Box padding='2' cursor="pointer"><div onClick={() => navigate('/entry/' + index.toString())}>
          <Heading>
            {article.title ? article.title.replace('#', '') : "Untitled"}
          </Heading>
        </div>
        </Box>
        <Box padding='2'>
          <Text align='left'>{
            // article.content.replace(/#/g, '').replace(/\n/g, '').substring(0, 100) 
            article.contentDigest.replace('#', '') + '...'}
          </Text>
        </Box>
        <Flex align="center" justify='space-between'>
          <Tag>{time}</Tag>
          <Tag>
            {
              liking
                ?
                <Spinner size='xs' color="grey" />
                :
                <Text color=
                  {
                    isLiked ?
                      "red" : "grey.300"
                  }
                  cursor='pointer'
                  onClick={handleLike}>
                  &hearts;
                </Text>
            }
            &nbsp;
            <Text color='grey'>
              {(Number(article.likes.length) + Number(isLiked)).toString()}
            </Text>
          </Tag>
        </Flex>
      </Box>
    </Stack>
  )
}

export const PlazaPage: React.FC = () => {
  const [articleList, setArticleList] = useState([])
  const [mounted, setMounted] = useState(false)
  const dfusionActor = useDfusionActor(undefined)

  // update states
  useEffect(() => {
    dfusionActor && dfusionActor?.getEntries(Number(10), Number(0)).then(res => {
      console.log('res: ', res);
      var articles: any = []
      if (res.length > 0) {
        for (var i = res.length - 1; i >= 0; i--) {
          // if (res[i].deleted) {
          //   continue;
          // }
          articles.push(<PlazaDigest entry={res[i]} key={i} />)// <EntryElement article={res[i]} key={i} />)
        }
      }
      if (!mounted) {
        setArticleList(articles)
        setMounted(true)
      }
    }).catch(error => {
      console.log('error: ', error)
    })
  }, [dfusionActor])

  return (
    <Flex flexDir='column'
      alignItems='center'
      width='100%'
      maxWidth='800px'
      height='85%'
      margin='0 auto'
      padding='88px'
      minHeight='90vh'
      style={{
        backgroundImage: `url("./homebg.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}>
      <br />
      {/* <Image src='./wifilogo75.svg' padding='10px' /> */}
      <Box padding="1" >
        <Text fontSize='2xl' fontWeight='bold' >Spread the idea of Web3.</Text>
      </Box>
      {articleList.length <= 0 ?
        <>
          <br />
          <Skeleton isLoaded={false} borderRadius={10} width='100%' height='150px' />
          <br />
          <Skeleton isLoaded={false} borderRadius={10} width='100%' height='150px' />
          <br />
          <Skeleton isLoaded={false} borderRadius={10} width='100%' height='150px' />
        </>
        : articleList}
    </Flex>
  )
}


export const PlazaDigest = ({ entry }: { entry: EntryDigest }) => {
  const navigate = useNavigate()

  return <>
    <Flex flexDir='column'
      bgColor='white'
      padding='20px'
      width='100%'
      boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
      maxW={620}
      margin='20px 0'
      borderRadius={20}>

      <Text fontWeight='bold' fontSize={36} lineHeight='40px' > {entry.title.replaceAll('#', '')} </Text>
      <Flex margin='10px 0' alignItems='center'>
        <Circle size='24px' cursor='pointer' onClick={() => {
          navigate('/profile/' + entry.creator.toText())
        }}>
          <Avatar name={entry.creator.toText()} />
        </Circle> &nbsp;&nbsp;
        <Badge textTransform='lowercase'
          borderRadius='10px'
          fontSize={14}
          fontWeight='regular'
          padding='0 10px'
          opacity={0.6}
          height='fit-content'
          width='fit-content'>
          {shortPrincipal(entry.creator.toText(), 5, 3)}
        </Badge>
        &nbsp;&nbsp;
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
      </Flex>
      <Text fontWeight='medium' fontSize={16} opacity={0.87}>
        {entry.contentDigest.replaceAll('#', '').replaceAll('\\', '')}
      </Text>
      {entry.cover?.length > 0
        &&
        <Image marginTop='20px'
          maxH={160}
          fit='cover'
          borderRadius={10}
          src={entry.cover[0]} />
      }
    </Flex>
  </>
}