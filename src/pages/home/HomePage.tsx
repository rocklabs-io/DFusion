import React from "react";

import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Button, Stack, ThemeProvider, Text, Box, Card } from "degen";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["page-content"]}
      style={{ 
        backgroundImage: `url("./homebg.jpg")`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
        backgroundPosition: 'center center' }}>
      
      <div> logo image </div>
      <Text>
        <h1>Spread the idea of Web3.</h1>
        <Stack align={"center"} justify={"center"}>
          <Card padding="6" width="128" shadow>
            <Stack align={"center"} justify={"center"}>
              We're creators.
              <h1>Let's get started</h1>
              <Button loading={true} > New Entry </Button>
            </Stack>
          </Card>
        </Stack>
      </Text>
    </div>);
}

//