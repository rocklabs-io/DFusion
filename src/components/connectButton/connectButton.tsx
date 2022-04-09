import { addIcpSuffix, shortPrincipal } from "src/canisters/utils";
import { useMemo } from "react"
import { GoTriangleDown } from 'react-icons/go'
import { useAppDispatch, usePlugStore, plugActions, FeatureState,} from "src/store";
import { ENV } from "src/config/env"
import { disconnect, requestConnect, usePlugInit } from 'src/components/plug';
import { Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, useClipboard, useToast } from "@chakra-ui/react";

export const ConnectButton = () => {

  const { principalId, isConnected, state: plugState, reverseName } = usePlugStore();

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
      <MenuButton colorScheme='regular'
        width={reverseName ? '160px' : '130px'}
        height='43px'
        color='white'
        as={Button}
        rightIcon={<Icon color='white' as={GoTriangleDown}/>}>
        {reverseName ? (reverseName.length > 14 ?
          shortPrincipal(addIcpSuffix(reverseName! as string) as string, 4, 8) : addIcpSuffix(reverseName! as string)) : shortPrincipal(principalId)}
      </MenuButton>
      <MenuList 
        minWidth={reverseName ? '160px' : '130px'} 
        borderRadius='20px'>
        <MenuItem onClick={() => {
          onCopy()
          toast({
            status: 'success',
            title: 'Copied Principal ID to your ClipBoard',
            duration: 3000,
          })
        }}>Copy Principal ID</MenuItem>
        <MenuItem onClick={() => {
          handleDisconnect()
        }
        }>Disconnect</MenuItem>
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
        "Loading" : "Connect"}
    </Button>
  }</>
}