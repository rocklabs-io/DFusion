import { shortPrincipal } from "src/utils/utils";
import { useMemo } from "react"
import { MdChildCare, MdFavoriteBorder, MdLogout, MdOutlineSettings, MdPersonOutline } from 'react-icons/md'
import { useAppDispatch, usePlugStore, plugActions, FeatureState, } from "src/store";
import { ENV } from "src/config/env"
import { disconnect, requestConnect, usePlugInit } from 'src/components/plug';
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, useClipboard, useToast, Text, Circle } from "@chakra-ui/react";
import { useUserExtStore } from "src/store/features/userExt";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";

export const ConnectButton = () => {

  const { principalId, isConnected, state: plugState, reverseName } = usePlugStore();
  const { name } = useUserExtStore()
  const navigate = useNavigate()

  const dispatch = useAppDispatch();

  const handleConnect = (isConnected: boolean) => {
    dispatch(plugActions.setIsConnected(isConnected));
  };
  const { hasCopied, onCopy } = useClipboard(principalId!)
  const toast = useToast()

  usePlugInit()

  const handleDisconnect = async () => {
    dispatch(plugActions.setIsConnected(false));
    dispatch(plugActions.setState(FeatureState.Disconnected))
    await disconnect()
  };

  const isLoading = useMemo(() => {
    return plugState === FeatureState.Loading;
  }, [plugState]);

  const clickConnect = async () => {
    if (!Boolean(window.ic?.plug)) {
      // jump to plug install page
      window.open('https://plugwallet.ooo/', '_blank');
      return;
    }

    try {
      dispatch(plugActions.setState(FeatureState.Loading));

      const isConnected = await requestConnect({
        whitelist: Object.values(ENV.canisterIds),
        host: ENV.host,
      });

      if (isConnected) {
        handleConnect(isConnected);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(plugActions.setState(FeatureState.Idle));
    }
  }

  return <>{isConnected ?
    <Menu>
      <Flex >
        <Flex flexDirection='column'
          textAlign='right'
          minWidth='150px'
          marginRight='12px'>
          <Text fontWeight='bold'
            fontSize={14} //name.length > 0 ? Math.floor(200 / Number(name[0])) 
            lineHeight='19px'
            cursor='pointer'
            onClick={() => { navigate('/profile/' + principalId) }}>
            {name.length > 0 ? name[0] : 'Unnamed'}
          </Text>
          <Text cursor='pointer' onClick={() => {
            onCopy()
            toast({
              status: 'success',
              title: 'Copied your PID to ClipBoard.',
              duration: 3000,
            })
          }}>{reverseName !== '' ?
            reverseName :
            shortPrincipal(principalId)}
          </Text>
        </Flex>
        <MenuButton
          width='fit-content'
          color='white'
          cursor='pointer'
          as={Circle}
          _hover={{
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
          }}
        // rightIcon={<Icon color='white' as={GoTriangleDown} />}
        >
          {/* {reverseName ? (reverseName.length > 14 ?
          shortPrincipal(addIcpSuffix(reverseName! as string) as string, 4, 8) : addIcpSuffix(reverseName! as string)) : shortPrincipal(principalId)} */}
          <Avatar name={principalId} />
        </MenuButton>
      </Flex>
      <MenuList
        minWidth='160px'// {reverseName ? '160px' : '130px'}
        fontSize={16}
        padding='10px'
        marginTop='20px'
        fontWeight='medium'
        borderRadius='20px'
        border='none'
        boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
      >
        <MenuItem
          margin='10px 0'
          icon={<MdFavoriteBorder color='black' opacity={0.6} size={24} />}
          borderRadius={10}
          onClick={() => {
            navigate('/favorites')
          }}
        >Favorites</MenuItem>
        <MenuItem
          margin='10px 0'
          icon={<MdChildCare color='black' opacity={0.6} size={24} />}
          borderRadius={10}
          onClick={() => {
            navigate('/following/' + principalId)
          }}>Following</MenuItem>
        <MenuItem
          margin='10px 0'
          icon={<MdPersonOutline color='black' opacity={0.6} size={24} />}
          borderRadius={10}
          onClick={() => {
            navigate('/profile')
          }}>My profile</MenuItem>
        <MenuItem
          borderRadius={10}
          margin='10px 0'
          icon={<MdOutlineSettings color='black' opacity={0.6} size={24} />}
          onClick={() => {
            navigate('/setting')
          }
          }>Profile settings</MenuItem>
        <MenuItem
          borderRadius={10}
          margin='10px 0'
          icon={<MdLogout color='black' opacity={0.6} size={24} />}
          onClick={() => {
            handleDisconnect()
          }}>
          Log out</MenuItem>
      </MenuList>
    </Menu>
    :
    <Button
      colorScheme='regular'
      width='130px'
      height='43px'
      color='white'
      onClick={() => {
        clickConnect()
      }}>
      {isLoading ?
        "Loading..." : "Connect"}
    </Button>
  }</>
}