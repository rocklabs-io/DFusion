import React from "react";

import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Button, Stack, ThemeProvider, Text, Heading, Card } from "degen";

export const HomePage: React.FC = () => {

  

  return (
    <div className={styles["page-content"]}
      style={{ 
        backgroundImage: `url("./homebg.jpg")`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
        backgroundPosition: 'center center' }}>
      <div> logo image </div>
        <Card padding="20" >
        <a style={{fontSize: '60px', fontWeight: 'bold'}} >Spread the idea of Web3.</a>
        </Card>
        <Stack align={"center"} justify={"center"}>
          <Card padding="6" width="128" shadow>
            <Stack align={"center"} justify={"center"}>
              We're creators.
              <h1>Let's get started</h1>
              <Button loading={true} > New Entry </Button>
            </Stack>
          </Card>
        </Stack>

    </div>);
}
