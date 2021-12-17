import React, {useState} from "react";
import { useLocation, useMatch, useNavigate, useParams } from "react-router";
import { Stack, Button } from "degen"; 
import { shortPrincipal } from "../../canisters/utils";
import styles from './Header.module.css';
declare let window: any;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [addState, setAddState] = useState(false);
  const [addString, setAddString] = useState("Not Connected");

  console.log("location:"+location.pathname)

  const clickConnect = async () => {   
    const canisterId = 'kqomr-yaaaa-aaaai-qbdzq-cai'
    // Whitelist
    const whitelist = [
      canisterId
    ];
    // Make the request
    // var result = await window.ic.plug.isConnected();
    // console.log(result)
    // if(!result) {
    var result = await window.ic.plug.requestConnect({whitelist}); // 
    // }
    // console.log(result)
    if(result){
      var address = await window.ic.plug.agent.getPrincipal();
      console.log(address)
      if(address!=""){
        sessionStorage.setItem("address",address)
        setAddState(true)
        console.log("in pid: "+address)
        // setAddString((""+address as string).substring(0, 7)+"...")
        setAddString((shortPrincipal(address.toText())))
      }
    }    
  }

  // disconnect account
  const disConnect = () => {
    setAddState(false)
    sessionStorage.removeItem("address")
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
        <div className={styles.headerLogo} onClick={()=>{navigate('/')}}>
            <img src="./dfusion136.svg" alt="DFUSION" />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
        {addState? <Stack align="center">
          <Button onClick={clickConnect}
            width='40'
            // prefix={<IconLockClosed />}
            variant="primary"
            // width={{ xs: 'full', md: 'max' }}
          >
            {addString}
          </Button>
        </Stack>
        :
        <Stack align="center">
          <Button onClick={clickConnect}
            width='40'
            // prefix={<IconLockClosed />}
            variant="primary"
            // width={{ xs: 'full', md: 'max' }}
          >
            Connect Plug
          </Button>
        </Stack>}

        {/* <div className={styles.addressBlock}>
          <div className={styles.dropdownList} onClick={clickConnect}>
            <img style={{height: '23px', paddingTop: '0'}} src='./plugDark.svg' />
           { addState ? addString : "Connect Plug"}
            </div>
        </div> */}
        </div>
      </div>

    </div>
  )
}