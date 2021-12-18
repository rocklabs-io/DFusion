import React, {useEffect, useState} from "react";
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

  useEffect(() => {
    const hasAgent = localStorage.getItem("hasAgent");
    if(hasAgent != "true") {
      return;
    }
    const pid = localStorage.getItem("principal");
    console.log(pid)
    if(pid && pid != "") {
      setAddState(true);
      setAddString((shortPrincipal(pid)));
    }
  })

  const clickConnect = async () => {   
    const pid = localStorage.getItem("principal");
    console.log(pid)
    if(pid && pid != "") {
      setAddState(true)
      setAddString((shortPrincipal(pid)))
      return;
    }

    const canisterId = 'kqomr-yaaaa-aaaai-qbdzq-cai'
    const whitelist = [
      canisterId
    ];
    var result = await window.ic.plug.requestConnect({whitelist}); // 
    if(result){
      var principal = await window.ic.plug.agent.getPrincipal();
      if(principal != ""){
        localStorage.setItem("principal", principal.toText())
        setAddState(true)
        setAddString((shortPrincipal(principal.toText())))
      }
    }    
  }

  // disconnect account
  const disConnect = () => {
    setAddState(false)
    localStorage.removeItem("principal")
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
        <div className={styles.headerLogo} onClick={()=>{navigate('/')}}>
            <img src="/dfusion136.svg" alt="DFUSION" />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
        {addState? <Stack align="center">
          <Button onClick={clickConnect}
            size="small"
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
            size="small"
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