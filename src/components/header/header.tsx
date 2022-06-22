import React from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import styles from './header.module.css';
import { ConnectButton } from "../connectButton";
import { useUserExtInit } from "../userExt/use-userExt-init";
import { Flex } from "@chakra-ui/react";
import { IoCompassOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io"
import { usePlugStore } from "src/store";
import { useUserExtStore } from "src/store/features/userExt";
import { SearchBar } from "../seacrchInput";
// declare let window: any;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // init all user info, valid after connect plug
  useUserExtInit()
  const { principalId, reverseName } = usePlugStore()
  const { name } = useUserExtStore()

  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
        <Flex alignItems='center'
          fontSize='16px'
          fontWeight='bold'
          color='#666666'>
          <div className={styles.headerLogo}
            onClick={() => { navigate('/') }}>
            <img src="/dfusion136.svg" alt="DFUSION" />
          </div>
          <Flex height='100%'
            alignItems='center'
            margin='0 20px'
            padding='4px'
            cursor='pointer'
            onClick={() => { navigate('/plaza') }} >
            <IoCompassOutline color="#bebebe" size='32px' />
            &nbsp;Explore
          </Flex>
          <div style={{ height: '40px', borderLeft: '1px solid #E2E8F0' }} />
          <Flex height='100%'
            alignItems='center'
            margin='0 20px'
            padding='4px'
            cursor='pointer'
            onClick={() => { navigate('/edit') }}>
            <IoMdAddCircleOutline color="#bebebe" size='32px' />
            &nbsp;Create
          </Flex>
        </Flex>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
            <SearchBar />
          {/* {typeof (principalId) !== 'undefined'
            && principalId !== '' ? */}
            <ConnectButton />
        </div>
      </div>
    </div>
  )
}