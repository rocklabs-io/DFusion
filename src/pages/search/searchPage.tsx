import { Flex, Icon, Stack, Text, Button, Skeleton } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSearchActor } from "src/canisters/actor/use-search-actor"
import { SearchResult } from "src/canisters/model/index.did"
import { MdArrowForward, 
    MdArrowBackIos, 
    MdArrowForwardIos } from "react-icons/md"
import { EmptyResult, SearchResultBar } from "./components"

export const SearchPage: React.FC = () => {

  const { qtext } = useParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const actor = useSearchActor()

  useEffect(() => {
    if (actor && qtext) {
      setLoading(true)
      actor.search(qtext).then((res: SearchResult[]) => {
        setLoading(false)
        setResults(res)
      })
    } 
  }, [actor, qtext])

  return <Stack pt='80px' gap='0.8rem'
    minHeight='80vh'
    align='center'
    margin='0 auto'
    maxWidth='700px'
    width='100%'>
    <Flex width='100%'
      margin='20px 0'
      fontSize={16}
      justifyContent='space-between'>
      <Text>Result for <b>{qtext}</b></Text>
      <Text> Total {results.length} results</Text>
    </Flex>
    {results.slice(page * pageSize, (page + 1) * pageSize)
      .map((item, index) =>
      <SearchResultBar result={item} text={qtext} key={index} />
    )}{
      results.length <= 0 && 
      <Skeleton borderRadius={12} width='100%' isLoaded={!loading}>
        <EmptyResult /> </Skeleton>
    }
    <Flex
      fontSize={14}
      height='56px'
      alignItems='center'
      alignSelf='flex-end'>
      <Flex marginRight='20px'>
        <Text >{
          page * pageSize + 1 + ' - ' +
          Math.min(page * pageSize + pageSize, results.length)
        }</Text> &nbsp;
        <Text color='gray.500'>of {results.length}</Text>
      </Flex>
      <Flex>
        <Button variant='ghost'
          padding='0'
          minWidth='0'
          height='fit-content'
          disabled={page <= 0}
          onClick={() => {
            setPage(page - 1)
          }} >
          <Icon boxSize='12px' as={MdArrowBackIos} />
        </Button>
        <Button variant='ghost'
          padding='0'
          minWidth='0'
          height='fit-content'
          disabled={(page * pageSize + pageSize) > results.length}
          onClick={() => {
            setPage(page + 1)
          }} >
          <Icon boxSize='12px' as={MdArrowForwardIos} />
        </Button>
      </Flex>
    </Flex>
  </Stack>
}
