import React, { useEffect, useState, useRef } from "react";
import styles from "./HomePage.module.css";
import { Button, Stack, Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Image } from "@chakra-ui/react";
import "@fontsource/roboto/300.css"
import { IoLogoTwitter } from "react-icons/io5";

export const HomePage: React.FC = () => {

  const [offset, setOffset] = useState(0);
  const mountedRef = useRef(true)
  // let mounted = false // set false after navigate
  let navigate = useNavigate()

  useEffect(() => {
    var scrollArrow = document.getElementById("scrollArrow")
    if (mountedRef) {
      window.onscroll = () => {
        setOffset(window.pageYOffset)
        if (scrollArrow) {
          var nscale = 1.0 + window.pageYOffset / 100
          var ntranslatex = 50 / nscale
          scrollArrow.style.transform = "scale(" + nscale + ") translate(-" + ntranslatex + "%, -50%)"
        }
      }
    }
  }, []);

  if (document.documentElement.scrollHeight >= window.pageYOffset + window.innerHeight - 10) {
    mountedRef.current = false
    // console.log('/plaza')
    // navigate('/plaza')
  }

  return (<>
    <Flex className={styles["page-content"]}
      flexDirection='column'
      height='calc(100vh - 104px)'
      justifyContent='center'
      alignItems='center'>
      <Flex height='60%'
        width='100%'
        maxWidth='690px'
        flexDir='column'
        alignItems='center'
        justifyContent='space-between' >
        <Image src="./dfusion244.svg" />
        <Box width='100%'>
          <Box width='fit-content'
            height='64px'
            padding='0 24px'
            fontWeight='light'
            fontSize='24px'
            lineHeight='64px'
            marginBottom='18px'
            backdropFilter='blur(40px)'>
            Web3 Knowledge base.
          </Box>
          <Box
            height='48px'
            padding='0 24px'
            fontWeight='300'
            fontSize='24px'
            lineHeight='48px'
            float='right'
            backdropFilter='blur(40px)'>
            Connect to Web3.
          </Box>
        </Box>
        <Button colorScheme='regular'
          width='282px'
          height='52px'
          fontSize='20px'
          borderRadius='30px'
          onClick={() =>
            navigate('/edit')}> Explore </Button>
      </Flex>
    </Flex>
    <Flex width='100%'
      height='44px'
      alignItems='center'
      justifyContent='center'
      fontWeight='light'
      fontSize='14px'
      color='rgba(0, 0, 0, 0.6)'
      backdropFilter='blur(40px)'>
      <Flex alignItems='center'
        cursor='pointer'>
        <IoLogoTwitter fill='rgba(0, 0, 0, 0.1)' size='24px' />
        &nbsp;Twitter
      </Flex>
      <Flex alignItems='center'
        cursor='pointer'>
        <Box height='20px' margin='0 10px' borderLeft='1px solid #CCCCCC' />
        <Image src='rocklabs-icon.svg'></Image>
        &nbsp;Rocklabs
      </Flex>
    </Flex>
  </>
  );
}
