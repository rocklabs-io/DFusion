import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "rich-markdown-editor";
import styles from "./EditPage.module.css"
import { light as lightTheme } from "./styles/theme";
import { Identity, useDfusionActor } from "src/canisters/actor";
import { useToast, Button, Box } from "@chakra-ui/react";
// import { NFTStorage } from "nft.storage";
const { NFTStorage } = require('nft.storage')

export const EditPage: React.FC = () => {
  var text = "";
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate()
  const toast = useToast()
  const dfusionActor = useDfusionActor(Identity.caller)

  // storage client
  const NFT_STORAGE_TOKEN = `${process.env.REACT_APP_IPFS_TOKEN}`
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
  const uploadCar = async (img: File) => {
    // // convert image to blob
    const { car } = await NFTStorage.encodeBlob(img)
    const cid = await client.storeCar(car)
    console.log(cid)
    return 'https://nftstorage.link/ipfs/'+cid
  }

  const handleSubmit = async () => {
    console.log(text)
    setLoading(true);
    let titleEnd = text.indexOf('\n');
    let title = text.slice(0, titleEnd);
    let content = text.slice(titleEnd + 1);
    dfusionActor?.createEntry(title, content).then((result)=>{
      if (!result || 'err' in result) {
        toast({
          title: "Fail",
          description: '' + result?.err ?? 'unknown reason.',
          status: "error",
          duration: 3000
        })
      }
      if ('ok' in result!) {
        toast({
          title: "Success",
          description: 'Entry was published successfully.',
          status: "success",
          duration: 3000
        })
        navigate('/entry/' + result.ok?.toString());
      }
    }).finally(()=>{
      setLoading(false)
    })
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
          placeholder={'\# Title \n Hello creator! Write something here.'}
          onImageUploadStart={()=>{
            toast({
              title: 'start upload',
              duration: 3000,
            })
          }}
          onImageUploadStop={()=>{
            toast({
              title: 'upload stoped',
              duration: 3000,
            })
          }}
          uploadImage={async file => {
            return uploadCar(file)
          }}/>
        <Box className={styles.buttonBox}>
          <Button onClick={handleSubmit}
            colorScheme='regular'
            isLoading={loading}
            disabled={loading}> Publish </Button>
        </Box>
      </div>
    </>)
}