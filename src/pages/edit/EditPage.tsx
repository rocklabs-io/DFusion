import React from "react";
import Editor from "rich-markdown-editor";
import { Button } from "degen";
import styles from "./EditPage.module.css"
import { idlFactory } from "../../canisters/dfusion.did";
declare let window: any;

export const EditPage: React.FC = () => {

  const createEntry = async (content: string) => {
    const canisterId = "kqomr-yaaaa-aaaai-qbdzq-cai"
    const whitelist = [canisterId]
    await window.ic.plug.requestConnect({
      whitelist: whitelist, 
    })

    const actor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    console.log(sessionStorage.getItem('identity'))
    const ret = await actor.createEntry(content)
    console.log('ret: ', ret)
  }

  var content = "";

  const handleSubmit = async () => {
    console.log(content)
    await createEntry(content)
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