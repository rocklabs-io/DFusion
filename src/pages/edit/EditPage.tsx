import React from "react";
import Editor from "rich-markdown-editor";
import { Button, Box } from "degen";
import styles from "./EditPage.module.css"
import { createEntry } from "../../canisters/utils";
import {light as lightTheme} from "./styles/theme";

export const EditPage: React.FC = () => {
  var content = "";

  const handleSubmit = async () => {
    console.log(content)
    let result = await createEntry(content)
    console.log('submit result:', result);
  }

  const onChange = async (txt: string) => {
    console.log(txt)
    content = txt;
  }

  return(
    <>
    <div className={styles.pageContent}>
      <Editor
        theme={lightTheme}
        onChange={getValue => onChange(getValue())}
        placeholder="# Hello creator! Write something here."/><Box className={styles.buttonBox}><Button onClick={handleSubmit} > submit </Button></Box>
    </div>
    
    </>)
}