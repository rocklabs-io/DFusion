import React from "react";

import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Button, Stack, ThemeProvider, Text, Heading, Card } from "degen";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["page-content"]}
      style={{ 
        backgroundImage: `url("./homebg.jpg")`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
        backgroundPosition: 'center center' }}>
      <div className={styles["logo"]}> 
      <img  src='./logo.svg' />  
      </div>
      <div className={styles["slogan"]}>
        <Card padding="20" >
        <a style={{fontSize: '60px', fontWeight: 'bold'}} >Spread the idea of Web3.</a>
        </Card>
      </div>
      <div className={styles["card"]}>
        <Stack align={"center"} justify={"center"}>
          <Card padding="6" width="128" shadow>
            <Stack align={"center"} justify={"center"}>
              We're creators.
              <h1>Let's get started</h1>
              <Button loading={false} > New Entry </Button>
            </Stack>
          </Card>
        </Stack>
        </div>

    </div>);
}
