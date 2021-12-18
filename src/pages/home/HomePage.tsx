import React, { useEffect, useState, useRef } from "react";
import styles from "./HomePage.module.css";
import { Button, Stack, Card, Box } from "degen";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {

  const [offset, setOffset] = useState(0);
  const mountedRef = useRef(true)
  // let mounted = false // set false after navigate
  let navigate = useNavigate()
  
  useEffect(()=>{
    var scrollArrow = document.getElementById("scrollArrow")
    if(mountedRef){
      window.onscroll = () => {
        setOffset(window.pageYOffset)
        if(scrollArrow){
          var nscale = 1.0+window.pageYOffset/100
          var ntranslatex = 50/nscale
          scrollArrow.style.transform="scale("+nscale+") translate(-"+ntranslatex+"%, -50%)"
        }
      }
    }
  }, []);

  if(offset>70){
    mountedRef.current=false
    navigate('/plaza')
    // navigate('/content')
  }

  return (
    <div className={styles["page-content"]}
      style={{ 
        backgroundImage: `url("./homebg.jpg")`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
        backgroundPosition: 'center center' }}>
      <div className={styles.logo}> 
      <img src='./wifilogo190.svg' />  
      </div>
      <div className={styles["slogan"]}>
        <Card padding="10" >
        <a style={{textAlign:'center', fontSize: '60px', fontWeight: 'bold'}}>Connect to Web3 via <img className={styles.textLogo} src="./dfusion244.svg" /></a>
        </Card>
      </div>
      <Stack align={"center"} justify={"center"}>
        <Card padding="6" width="128" shadow>
          <Stack align={"center"} justify={"center"}>
            Thinkers,
            <h1>Let's get started</h1>
            <Button loading={false} onClick={()=>navigate('/edit')}> New Entry </Button>
          </Stack>
        </Card>
        
      </Stack>
      <Box alignItems='center' justifySelf='center' id="scrollArrow" className={styles.scrollArrow}>
        <img src="./chevrons-down.svg"></img>
        <div>Scroll down to enter the Web3</div>
      </Box>
    </div>);
}
