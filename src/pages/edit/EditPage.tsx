import React from "react";
import Editor from "rich-markdown-editor";
import styles from "./EditPage.module.css"
export const EditPage: React.FC = () => {

  return(
    <div className={styles.pageContent}>
      <Editor
        defaultValue="# Hello world!"/>
    </div>)
}