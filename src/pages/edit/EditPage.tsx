import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "rich-markdown-editor";
import { Button, Box } from "degen";
import styles from "./EditPage.module.css"
import { createEntry } from "../../canisters/utils";
import {light as lightTheme} from "./styles/theme";

export const EditPage: React.FC = () => {
  var content = "";
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate()

  const handleSubmit = async () => {
    console.log(content)
    setLoading(true);
    let result = await createEntry(content)
    setLoading(false);
    console.log('submit result:', result);
    navigate('/entry/' + result.toString());
  }

  const onChange = async (txt: string) => {
    content = txt;
  }

  return(
    <>
    <div className={styles.pageContent}>
      <Editor
        theme={lightTheme}
        onChange={getValue => onChange(getValue())}
        placeholder="# Hello creator! Write something here."/>
        <Box className={styles.buttonBox}>
          <Button onClick={handleSubmit} loading={loading} disabled={loading}> Publish </Button>
        </Box>
    </div>
    
    </>)
}