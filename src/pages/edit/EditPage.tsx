import React from "react";
import Editor from "rich-markdown-editor";
import { Button } from "degen";
import styles from "./EditPage.module.css"
import { createEntry } from "../../canisters/utils";

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
    <div className={styles.pageContent}>
      <Button onClick={handleSubmit} > submit </Button>

      <Editor
        onChange={getValue => onChange(getValue())}
        defaultValue="# Hello world!"/>
    </div>)
}