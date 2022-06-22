import { Center } from "@chakra-ui/react"

export const EmptyResult = ({ text = "😯 Found nothing here." }: { text?: string }) => {
  return <Center height='80px' fontSize={16} width='100%'>
    {text}
  </Center>
}