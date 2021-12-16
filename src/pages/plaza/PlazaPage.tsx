import React from "react";
import styles from './PlazaPage.module.css';
import { Button, Stack, Heading, Text, Box, Card, Tag } from "degen";
import Avatar from "boring-avatars";

export const PlazaPage: React.FC = () => {

  return (
    <>
      <div className={styles.pageContent}
        style={{
          backgroundImage: `url("./homebg.jpg")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}>

        <div> logo image </div>
        <Card padding="5" >
          <a style={{ fontSize: '30px', fontWeight: 'bold' }} >Spread the idea of Web3.</a>
        </Card>
        <Stack align='center'>
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
        </Stack>

      </div>
    </>
  )
}