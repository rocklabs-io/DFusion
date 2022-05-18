import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Flex, Text, Image, Circle, useToast, Skeleton, Center } from "@chakra-ui/react"
import { EntryDigest, UserExt } from "../../../canisters/model/dfusiondid"
import { getTimeString, shortPrincipal } from "src/canisters/utils";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import Avatar from "boring-avatars";
import Editor from "rich-markdown-editor";
import { light as lightTheme } from "../../edit/styles/theme";
import { userExtAction, useUserExtStore } from "src/store/features/userExt";
import { useAppDispatch, usePlugStore } from "src/store";
import { IoMdLink } from "react-icons/io";

export const Digest = ({ entry }: { entry: EntryDigest }) => {
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
      <Text fontWeight='bold' fontSize={36} lineHeight='40px'>
        {entry.title}
      </Text>
      <Badge textTransform='lowercase'
        borderRadius='10px'
        fontSize={14}
        fontWeight='regular'
        margin='10px 0'
        padding='0 10px'
        opacity={0.6}
        width='fit-content'>
        {/* {shortPrincipal(principalId, 5, 3)} */}
        {getTimeString(entry.createAt)}
      </Badge>
      {/* <Text fontWeight='medium' fontSize={16} opacity={0.87}>
        {entry.contentDigest}
      </Text> */}
      <Editor theme={lightTheme} readOnly value={entry.contentDigest.replace('\n', '')} />
      {entry.cover?.length > 0
        &&
        <Image marginTop='20px'
          maxH={160}
          fit='cover'
          borderRadius={10}
          src={entry.cover[0]} />
      }
      <hr style={{ margin: '20px 0' }} />
      <Button color='regular.500'
        onClick={() => { navigate('/entry/' + entry.id) }}
      > Continue Reading
      </Button>
    </Flex>
    <hr />
  </>
}