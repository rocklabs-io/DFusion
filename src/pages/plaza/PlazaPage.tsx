import React, { useEffect, useState } from "react";
import { Stack, Heading, Text, Box, Tag, useToast, Spinner } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { useNavigate } from "react-router-dom";
import { getTimeString, shortPrincipal } from "../../canisters/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { EntryDigest } from "src/canisters/model/dfusiondid";
import { Flex } from "@chakra-ui/react";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch } from "src/store";
import { Banner, EntriesColumn } from "./components";

export const PlazaPage: React.FC = () => {

  return <Flex width='100%'
    maxW={940}
    flexDir='column'
    alignItems='center'
    height='85%'
    margin='0 auto'
    paddingTop='88px'
    minHeight='90vh'>
    <Banner />
    <Box width='100%'>
      <EntriesColumn />
    </Box>
  </Flex>
}

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
        <Flex align="center"
          justify='space-between'>
          <Tag>{time}</Tag>
          <Tag>
            { liking
                ?
                <Spinner size='xs' color="grey" />
                :
                <Text color={isLiked ? "red" : "grey.300"}
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