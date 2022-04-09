import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "rich-markdown-editor";
import { Button, Box } from "degen";
import styles from "./EditPage.module.css"
import { light as lightTheme } from "./styles/theme";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useToast } from "@chakra-ui/react";

export const EditPage: React.FC = () => {
  var text = "";
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate()
  const toast = useToast()
  const dfusionActor = useDfusionActor(Identity.caller)

  const handleSubmit = async () => {
    console.log(text)
    setLoading(true);
    let titleEnd = text.indexOf('\n');
    let title = text.slice(0, titleEnd);
    let content = text.slice(titleEnd + 1);
    let result = await dfusionActor?.createEntry(title, content)
    setLoading(false);
    if (!result || 'err' in result){
      toast({
        title: "Fail",
        description: '' + result?.err ?? 'unknown reason.',
        status: "error",
        duration: 3000
      })
    }
    if('ok' in result!){
      toast({
        title: "Success",
        description: 'Entry was published successfully.',
        status: "success",
        duration: 3000
      })
      navigate('/entry/' + result.ok?.toString());
    }
  }

  const onChange = async (txt: string) => {
    text = txt;
  }

  return (
    <>
      <div className={styles.pageContent}>
        <Editor
          theme={lightTheme}
          onChange={(value) => onChange(value())}
          placeholder="# Hello creator! Write something here." />
        <Box className={styles.buttonBox}>
          <Button onClick={handleSubmit} loading={loading} disabled={loading}> Publish </Button>
        </Box>
      </div>
    </>)
}