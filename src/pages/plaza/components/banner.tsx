import { Center, Image, Text } from "@chakra-ui/react";


export const Banner = () => <Center
  width='100%'
  flexDir='column'
  height='166px'
  borderRadius={20}
  bgColor='#D4E6FD'
  backgroundImage="./dfusion-bg.png"
  backgroundSize='cover'
  objectPosition='top'
  boxShadow='0px 4px 8px rgba(0, 0, 0, 0.1)'>
  <Center width='100%'
    height='166px'
    borderRadius={20}
    flexDir='column'
    backdropFilter='blur(8px)'
    background='linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)'>
    <Image width={184} src="./dfusion136.svg" />
    <Text fontWeight={300} fontSize={24}>Spread the idea of Web3.</Text>
  </Center>
</Center>