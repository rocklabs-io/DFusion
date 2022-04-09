import React, { useEffect, useState } from "react";
import { Stack, Heading, Text, Box, Tag, Image, Skeleton, useToast, Spinner } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { useNavigate } from "react-router-dom";
import { getTimeString, shortPrincipal } from "../../canisters/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { EntryDigestExt } from "src/canisters/model/dfusiondid";
import { Flex } from "@chakra-ui/react";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch } from "src/store";

// element 
const EntryElement = ({ article }: { article: EntryDigestExt }) => {

  var index = article.id
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
      console.log('like: ', res)
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
        <Box padding='2' cursor="pointer"><div onClick={() => navigate('/entry/' + index)}>
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
              {(Number(article.likesNum) + Number(isLiked)).toString()}
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

  // verify connect
  const getEntries = async () => {
    dfusionActor?.getEntries(10, 0).then(res => {
      console.log(res);
      var articles: any = []
      if (res.length > 0) {
        for (var i = res.length - 1; i >= 0; i--) {
          // if (res[i].deleted) {
          //   continue;
          // }
          articles.push(<EntryElement article={res[i]} key={i} />)
        }
      }
      if (!mounted) {
        setArticleList(articles)
        setMounted(true)
        console.log(articleList)
      }
    })
  };

  // update states
  useEffect(() => {
    getEntries()
    console.log('sent')
  }, [dfusionActor])

  return (
    <Flex flexDir='column'
      alignItems='center'
      width='100%'
      maxWidth='632px'
      height='85%'
      margin='auto'
      minHeight='90vh'
      style={{
        backgroundImage: `url("./homebg.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}>
      <br />
      <Image src='./wifilogo75.svg' padding='10px' />
      <Box padding="1" >
        <Text fontSize='2xl' fontWeight='bold' >Spread the idea of Web3.</Text>
      </Box>
      {articleList.length <= 0 ?
        <>
          <Skeleton isLoaded={false} width='100%' height='150px' />
          <br />
          <Skeleton isLoaded={false} width='100%' height='150px' />
          <br />
          <Skeleton isLoaded={false} width='100%' height='150px' />
        </>
        : articleList}
    </Flex>
  )
}