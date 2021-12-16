import React, {useState} from "react";
import { useLocation, useMatch, useNavigate, useParams } from "react-router";
import styles from './Header.module.css'
declare let window: any;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  var address = " "

  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);

  console.log("location:"+location.pathname)

  const clickConnect = async () => {
    // this.setState({step: 3});  // to confirm page..    
    const nnsCanisterId = 'ymglq-2qaaa-aaaah-qcbzq-cai'
    // Whitelist
    const whitelist = [
      nnsCanisterId, "yxdxv-aiaaa-aaaah-qcb3a-cai"
    ];
    // Make the request
    // var result = await window.ic.plug.isConnected();
    // console.log(result)
    // if(!result) {
    var result = await window.ic.plug.requestConnect({whitelist,}); // 
    // }
    // console.log(result)
    if(result){
      address = await window.ic.plug.agent.getPrincipal();
      if(address!=""){
        sessionStorage.setItem("address",address)
        setAdd(true)
        console.log("in pid: "+address)
        address = (sessionStorage.getItem("address") as string).substring(0, 7)+"..."
        setAdd(true)
      }
    }    
  }

  // dropdown state
  const handleDropDown = () => {
    setOpen(!open)
  }

  // disconnect account
  const disConnect = () => {
    setAdd(false)
    sessionStorage.removeItem("address")
  }

  const getDropDown = () => {
    return (
      <div className={styles.dropdownList}>
      { address }
      <img src='./tri.svg' onClick={handleDropDown}/> 
      { open 
      ? 
      <ul>
      <li onClick={disConnect}>Logout</li>
      </ul>
      :
      null}
    </div>
    )
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
        <div className={styles.headerLogo}>
            <h3 className={styles.headerTitle}>
              Logo DFusion
            </h3>
        </div>
        <div style={{width: '30%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
          <div className={styles.addressBlock}>
            {add?getDropDown() : <div className={styles.dropdownList} onClick={clickConnect}> <img style={{height: '25px', paddingTop: '0'}} src='./plugDark.svg' />Connect Plug</div>}
          </div>
        </div>
      </div>

    </div>
  )
}