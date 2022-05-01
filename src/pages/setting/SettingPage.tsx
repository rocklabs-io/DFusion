import { Badge, Button, Circle, Flex, Input, InputProps, Switch, Text } from "@chakra-ui/react"
import { usePlugStore } from "src/store"
import React, { useEffect, useState } from "react"
import Avatar from "boring-avatars"
import { shortPrincipal } from "src/canisters/utils"
import { IoMdLink } from "react-icons/io"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

export const SettingPage: React.FC = () => {

  const { principalId, reverseName } = usePlugStore()
  
  useEffect(()=>{

  }, [])

  return <>
    <Flex width='100%'
      flexDirection='column'
      margin='40px auto'
      maxW='480px'>
      <Flex width='100%'
        padding='20px'
        borderRadius='20px'
        backgroundColor='white'
        boxShadow='md'
        flexDirection='column'>
        <Flex width='100%'
          marginBottom='20px'
          justifyContent='space-between'>
          <Flex>
            {/* check avatar setting <Avatar size='xl'></Avatar> */}
            <Avatar size={80}
              name={'sssssx'}
              variant="marble" />
            <Flex marginLeft='20px'
              flexDirection='column'
              justifyContent='space-between'>
              <Text fontSize='24'
                lineHeight='28px'
                fontWeight='bold'>
                Username
              </Text>
              <Badge textTransform='lowercase'
                borderRadius='10px'
                fontSize='14px'
                fontWeight='regular'
                padding='0 10px'
                width='fit-content'>
                {shortPrincipal(principalId, 5, 3)}
              </Badge>
              <Text opacity='0.4' fontSize='14px' lineHeight='16px'>
                <span style={{ fontWeight: 'bold', opacity: '1.5' }}>{'1123'}</span> Following &nbsp;
                <span style={{ fontWeight: 'bold', opacity: '1.5' }}>{'1123'}</span> Follower
              </Text>
            </Flex>
          </Flex>
          <Flex height='32px' alignItems='center'>
            <Circle size='30px'
              border='1.5px solid #2663FF'>
              <IoMdLink color="#2663FF" size='18px' />
            </Circle>&nbsp;&nbsp;
            <Button
              fontWeight='medium'
              colorScheme='regular'
              height='32px'>
              Follow
            </Button>
          </Flex>
        </Flex>
        <Text fontSize='12' opacity='0.6'>
          Bio Bio Bio Bio Bio Bio
        </Text>
      </Flex>
      <br />
      <EditField name='Name' defaultValue={'xx'} />
      <br />
      <EditField name='Bio' defaultValue={'xx'} />
      <br />
      <Flex bgColor='white'
        borderRadius='20px'
        direction='column'
        width='100%'
        padding='20px'
        boxShadow='md'>
        <Flex flexGrow={1}
          alignItems='center'
          justifyContent='space-between'
          marginBottom='10px'
        >
          <Text fontSize={16}
            fontWeight='medium'>
            ICNS Shortlink
          </Text>
          <Switch defaultChecked isDisabled colorScheme='regular' />
        </Flex>
        <Flex alignItems='center'>
          <Circle size='30px'
            marginRight='10px'
            border='1.5px solid #2663FF'
            >
            <IoMdLink color="#2663FF" size='18px' />
          </Circle>
          <Input bgColor='#EDF2F7'
            disabled
            defaultValue={''}
            borderRadius='10px' />
        </Flex>
      </Flex>
    </Flex>
  </>
}

interface IEdit extends InputProps {
  name: string
}
export const EditField: React.FC<IEdit> = ({ name, ...props }) => {

  const [edit, setEdit] = useState(false)

  return <Flex bgColor='white'
    borderRadius='20px'
    direction='column'
    width='100%'
    padding='20px'
    boxShadow='md'
  >
    <Flex flexGrow={1}
      alignItems='center'
      justifyContent='space-between'
      marginBottom='10px'
    >
      <Text fontSize={16}
        fontWeight='medium'>
        {name}
      </Text>
      <Button height='32px'
        variant='outline'
        colorScheme='regular'
        onClick={() => { setEdit(!edit) }} >
        {edit ? 'Cancel' : 'Edit'}
      </Button>
    </Flex>
    <Input bgColor='#EDF2F7'
      disabled={!edit}
      defaultValue={props.defaultValue}
      borderRadius='10px' />
    {edit &&
      <Button
        marginTop='10px'
        colorScheme='regular'> Save
      </Button>}
  </Flex>
}


export default SettingPage;