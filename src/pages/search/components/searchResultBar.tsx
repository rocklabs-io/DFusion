import { Flex, Icon, Text } from "@chakra-ui/react"
import { SearchResult } from "src/canisters/model/index.did"
import { MdArrowForward } from "react-icons/md"

export const SearchResultBar = ({ result, text }: {
  result: SearchResult,
  text?: string
}) => {

  return <Flex justifyContent='space-between'
    alignItems='center'
    width='100%'
    padding='0 20px'
    margin='120px 0'
    height='48px'
    boxShadow='0px 4px 8px rgba(211, 211, 211, 0.20), 0px 12px 20px rgba(255, 255, 255, 0.01)'
    borderRadius={10}
    cursor='pointer'
    bgColor='white'
    onClick={() => {
      window.open('/entry/' + result.id.toString(), '_blank')
    }}
  >
    <Text noOfLines={1}
      fontSize={20}
      fontWeight='bold'
    > {result.title} </Text>
    <Icon as={MdArrowForward}
      boxSize='18px'
      color='regular' />
  </Flex>
} 