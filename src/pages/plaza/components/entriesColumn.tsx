import { useEffect, useState } from "react";
import { Text, Skeleton, Tabs, TabList, TabPanels, Tab, TabPanel, Center, toast, useToast } from "@chakra-ui/react";
import { useDfusionActor } from "src/canisters/actor";
import { Flex } from "@chakra-ui/react";
import { useUserExtStore } from "src/store/features/userExt";
import { usePlugStore } from "src/store";
import { Principal } from "@dfinity/principal";
import { PlazaDigest } from "./plazaDigest";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

export const EntriesColumn = () => {
  const [articleList, setArticleList] = useState([])
  const [followingList, setFollowingList] = useState([])
  const [mounted, setMounted] = useState(false)
  const dfusionActor = useDfusionActor(undefined)
  const { following } = useUserExtStore()
  const { principalId } = usePlugStore()
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  // following list 
  useEffect(() => {
    dfusionActor && principalId && dfusionActor?.getUserFollowingEntries(Principal.fromText(principalId)).then((res) => {
      var articles: any = []
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          articles.push(<PlazaDigest entry={res[i]} key={Number(res[i].id)} />)
        }
      }
      if (!mounted) {
        setFollowingList(articles)
        setMounted(true)
      }
    }).catch(error => {
      console.log('error: ', error)
    }).finally(() => {
      setLoading(false)
    })
  }, [dfusionActor, principalId])

  // latests list 
  useEffect(() => {
    dfusionActor && dfusionActor?.getEntries(Number(50), Number(0)).then(res => {
      var articles: any = []
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          articles.push(<PlazaDigest
            entry={res[i]}
            key={Number(res[i].id)} />)
        }
      }
      if (!mounted) {
        setArticleList(articles)
        setMounted(true)
      }
    }).catch(error => {
      console.error(error)
      toast({
        title: 'Fail to fetch data',
        description: 'Please check the network.',
        status: 'error',
        duration: 3000
      })
    }).finally(() => {
      setLoading(false)
    })
  }, [dfusionActor])

  const LoadingSkeletons = [160, 200, 220, 180].map((item, index) => <Skeleton borderRadius={10} width='100%' height={item.toString() + 'px'} key={index} />)

  const EmptyBlock = () => <Center width='100%'
    height='240px'
    borderRadius={20}
    boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
  >
    <Text fontSize='2xl'>
      🥱 No Posts Here
    </Text>
  </Center>

  return (
    <Flex flexDir='column'
      alignItems='center'
      width='100%'
      margin='32px 0'>
      <Tabs width='100%'
        colorScheme='regular'>
        <TabList width='100%'>
          <Tab fontWeight='bold'
            color='#9B9B9B'
            _selected={{
              color: 'regular.400',
              borderBottom: '2px solid blue'
            }}
            _focus={{
              border: 'none'
            }} >Following</Tab>
          <Tab fontWeight='bold'
            color='#9B9B9B'
            _selected={{
              color: 'regular.400',
              borderBottom: '2px solid blue'
            }}
            _focus={{
              border: 'none'
            }}>Latest</Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding='4px' marginTop='20px'>
            <ResponsiveMasonry columnsCountBreakPoints={{ 700: 1, 750: 2 }}>
              <Masonry gutter='20px'>
                {!loading && followingList.length <= 0 ?
                  <EmptyBlock />
                  : followingList}
                {loading && LoadingSkeletons}
              </Masonry>
            </ResponsiveMasonry>
          </TabPanel>
          <TabPanel padding='4px' marginTop='20px'>
            <ResponsiveMasonry columnsCountBreakPoints={{ 700: 1, 750: 2 }}>
              <Masonry gutter='20px'>
                {!loading && articleList.length <= 0 ?
                  <EmptyBlock />
                  : articleList}
                {loading && LoadingSkeletons}
              </Masonry>
            </ResponsiveMasonry>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}