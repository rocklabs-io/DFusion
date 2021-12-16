import React from "react";
import styles from './PlazaPage.module.css' 
import { Button, Stack, ThemeProvider, Text, Box, Card } from "degen";

export const PlazaPage: React.FC = () => {
  
  return(
    <>
      <div className={styles.pageContent}
      style={{ 
        backgroundImage: `url("./homebg.jpg")`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
        backgroundPosition: 'center center' }}>
      
      <div> logo image </div>
      <Text>
        <h1>Spread the idea of Web3.</h1>
        <Stack align={"center"} justify={"center"}>
          <Card padding="6" shadow>
            <div className={styles.startMenu}> 
            <h1>Let's get started</h1>
              <Box height="16" width="16">
                <Button loading={true} > New Entry </Button>
              </Box>
            </div>
          </Card>
        </Stack>
      </Text>
    </div>
    </>
  )
}