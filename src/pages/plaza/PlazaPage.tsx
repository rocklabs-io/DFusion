import React, { useEffect, useRef, useState } from "react";
import styles from './PlazaPage.module.css';
import { Spinner, Stack, Heading, Text, Box, Card, Tag } from "degen";
import Avatar from "boring-avatars";
import { getAllEntries } from "../../canisters/utils";
import { useNavigate } from "react-router-dom";
import { getTimeString, shortPrincipal } from "../../canisters/utils";
import { Header } from "../../components/Header";
declare let window: any;

// element 
const EntryElement = (article: any) => {

  console.log('/entry/'+article.index)
  var index = article.index
  let navigate = useNavigate()
  // procss article props
  article = article.article
  var creator = shortPrincipal(article.creator.toText())
  var paras = article.content.split('\n')
  var time = getTimeString(article.createAt)

  return (
    <Stack align='center'>
      <Box borderBottomWidth="0.5" width="2/3" borderColor='foregroundSecondary' padding="5">
        <Stack direction="horizontal" align="center">
          <Avatar size={32} name={creator} variant="marble" />
          {creator}
          <Tag>{creator}</Tag>
        </Stack>
        <Box padding='2' cursor="pointer"><div onClick={()=>navigate('/entry/'+index)}><Heading align="left" >{paras.length>1?paras[0].replace('#', ''):" No Title"}</Heading></div></Box>
        <Box padding='2'><Text align='left'>{article.content.replace('\n', '').replace('#', '').substring(0, 100)+'...'}</Text></Box>
        <Stack direction="horizontal" align="center" justify='space-between'>
          <Tag>{time}</Tag><Tag> <a style={{color:'red'}}>&hearts; </a>{article.likes.length}</Tag>
        </Stack>
      </Box>
    </Stack>
  )
}

export const PlazaPage: React.FC = () => {
  const [articleList, setArticleList] = useState([])
  const [mounted, setMounted] = useState(false)
  const [connected, setConnected] = useState(false)
  let navigate = useNavigate()
  
  // verify connect
  const verifyConnection = async () => {
    const canisterId = 'kqomr-yaaaa-aaaai-qbdzq-cai'
    // Whitelist
    const whitelist = [
      canisterId
    ];
    // const connected = await window.ic.plug.isConnected();
    // if (!connected) {
    //   await window.ic.plug.requestConnect({ whitelist});
    //   console.log('send request')  
    // }
    // else {
      getAllEntries().then(res => {
        // console.log(res);
        var articles:any = []
        if(res.length > 0) {
          for (var i=0; i<res.length; i++){
            if(res[i].deleted) {
              continue;
            }
            articles.push(<EntryElement article={res[i]} index={i} key={i} />)
          }
        }
        if (!mounted){
          setArticleList(articles)
          setMounted(true)
          console.log(articleList)
        }
      })
    // }
  };

  // update states
  useEffect(() => {
    verifyConnection()
    console.log('sent')
  }, [])

  return (
    <>
      <div className={styles.pageContent}
        style={{
          backgroundImage: `url("./homebg.jpg")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}>
        {/* <div> logo image </div> */}
        <div className={styles.logo}> 
          <img src='./wifilogo75.svg' />  
        </div>
        <Card padding="1" >
          <a style={{ fontSize: '30px', fontWeight: 'bold' }} >Spread the idea of Web3.</a>
        </Card>
        { articleList.length <= 0 ? <Stack align="center" ><Box padding="40" justifyContent="center"><Spinner size="large" color="accent" /></Box></Stack>:articleList }
        {/* <Stack align='center'>
          <Box borderBottomWidth="0.5" width="2/3" borderColor='foregroundSecondary' padding="5">
            <Stack direction="horizontal" align="center">
              <Avatar
                size={40}
                name="Maria Mitchell"
                variant="bauhaus"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
              Rocklabs
              <Tag>0x53d7</Tag>
            </Stack>
            <Box padding='2'><Heading align="left">Heading</Heading></Box>
            <Box padding='2'><Text align='left'>I encouraged the folks who started the ESR (e.g.,  @msbernst) to do this and helped get financial support. It has been a very positive experience for all (yes the researchers going through it) and I hope other universities do something similar. </Text></Box>
            <Stack direction="horizontal" align="center" justify='space-between'>
              <Tag>Decenmber 13th, 2021</Tag><Tag> <a style={{color:'red'}}>&hearts;</a> 37</Tag>
            </Stack>
          </Box>
        </Stack>
        <Stack align='center'>
          <Box borderBottomWidth="0.5" width="2/3" borderColor='foregroundSecondary' padding="5">
            <Stack direction="horizontal" align="center">
            <Avatar
              size={40}
              name="Maria Mitchell"
              variant="marble"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
              Rocklabs
              <Tag>0x53d7</Tag>
            </Stack>
            <Box padding='2'><Heading align="left">Start writing on mirror</Heading></Box>
            <Box padding='2'><Text align='left'>I encouraged  </Text></Box>
            <Stack direction="horizontal" align="center" justify='space-between'>
              <Tag>Decenmber 13th, 2021</Tag><Tag> <a style={{color:'red'}}>&hearts;</a> 44</Tag>
            </Stack>
          </Box>
        </Stack> */}

      </div>
    </>
  )
}

/**


 */