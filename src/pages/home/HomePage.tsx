import React, { useEffect, useState, useRef } from "react";
import styles from "./HomePage.module.css";
import { Button, Stack, Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Image } from "@chakra-ui/react";

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

  if (document.documentElement.scrollHeight >= window.pageYOffset + window.innerHeight - 10 ) {
    mountedRef.current = false
    // console.log('/plaza')
    navigate('/plaza')
  }

  // const [lastScrollPosition, setSP ] = useState(0)
  // window.onscroll = function(event)
  // {
  //   console.log(document.body.scrollTop)
  //   if((document.body.scrollTop == 0)&&(lastScrollPosition > 0))
  //   {
  //     alert("refresh");
  //   }
  //   setSP(document.body.scrollTop);
  // }


  return (
    <Flex className={styles["page-content"]}
      flexDirection='column'
      alignItems='center'
      style={{
        backgroundImage: `url("./homebg.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}>
      <Image marginTop='10vh' src='./wifilogo190.svg' />
      <div className={styles["slogan"]}>
        <Flex flexDir='column'
          alignItems='center'
          padding="10" >
          <Text
            style={{
              textAlign: 'center',
              fontSize: '60px',
              fontWeight: 'bold'
            }}
          >
            Connect to Web3 via
          </Text>
          <Image className={styles.textLogo} src="./dfusion244.svg" />
        </Flex>
      </div>
      <Stack borderRadius='12px'
        align={"center"}
        justify={"center"}
        shadow='2xl'>
        <Box 
          padding="6"
          width="auto" 
          dropShadow='outline'>
          <Stack align={"center"} justify={"center"}>
            Thinkers,
            <div style={{ fontWeight: 'bold', fontSize: '40px' }}>Let's get started</div>
            <Button colorScheme='regular'
              onClick={() => 
              navigate('/edit')}> New Entry </Button>
          </Stack>
        </Box>
      </Stack>
      <Flex flexDir='column'
        alignItems='center'
        id="scrollArrow"
        className={styles.scrollArrow}
      >
        <img src="./chevrons-down.svg"></img>
        <div>Scroll down to enter the Web3</div>
      </Flex>
    </Flex>);
}
