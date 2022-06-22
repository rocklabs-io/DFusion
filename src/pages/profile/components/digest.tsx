import { Badge, Button, Flex, Text, Image } from "@chakra-ui/react"
import { EntryDigest } from "../../../canisters/model/dfusion.did"
import { getTimeString } from "src/utils/utils";
import { useNavigate } from "react-router-dom";
import { parseMD } from "src/utils/utils";

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
      <Text fontWeight='medium' fontSize={16} opacity={0.87}>
        {parseMD(entry.contentDigest)}
      </Text>
      {/* <Editor theme={lightTheme} readOnly value={entry.contentDigest.replace('\n', '')} /> */}
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