import { Flex, Text, Skeleton } from "@chakra-ui/react"
import { Principal } from "@dfinity/principal"
import { useEffect, useState } from "react"
import { useDfusionActor } from "src/canisters/actor"
import { EntryDigest } from "src/canisters/model/dfusion.did"
import { usePlugStore } from "src/store"
import { ProfileDigest } from "../profile/components"
import { EmptyResult } from "../search/components"


export const FavoritesPage: React.FC = () => {

  const dfusionActor = useDfusionActor()
  const { principalId } = usePlugStore()
  const [entries, setEntries] = useState<EntryDigest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (dfusionActor && principalId) {
      setLoading(true)
      dfusionActor.getUserFavorites(
        Principal.fromText(principalId)
      ).then(res => {
        setEntries(res)
        setLoading(false)
      })
    }
  }, [dfusionActor, principalId])

  console.log('fav: ', entries)

  return <Flex width='100%'
    paddingTop='88px'
    flexDir='column'
    maxW={940}
    margin='0 auto'>
    <Flex flex='1' maxW={620} margin='10px 20px' flexDir='column'>
      <Text fontWeight='bold' lineHeight='28px' fontSize={24} >
        Favorites
      </Text>
    </Flex>
    <Flex flexDir='column'>
      {entries.map((item, index) =>
        <ProfileDigest entry={item} key={index} />
      )}
      {entries.length <= 0 &&
        <Skeleton isLoaded={!loading} borderRadius={12}>
          <EmptyResult />
        </Skeleton>}
    </Flex>
  </Flex>
}