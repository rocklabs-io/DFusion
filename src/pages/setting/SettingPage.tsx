import { Badge, Button, Circle, Flex, Input, InputProps, Switch, Text, useToast } from "@chakra-ui/react"
import { useAppDispatch, usePlugStore } from "src/store"
import React, { useEffect, useState } from "react"
import Avatar from "boring-avatars"
import { shortPrincipal } from "src/utils/utils"
import { IoMdLink } from "react-icons/io"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { userExtAction, useUserExtStore } from "src/store/features/userExt"
import { Identity, useDfusionActor } from "src/canisters/actor"

export const SettingPage: React.FC = () => {

  const { principalId, reverseName } = usePlugStore()
  const { name, followers, following, bio } = useUserExtStore()

  useEffect(() => {

  }, [])

  return <>
    <Flex width='100%'
      flexDirection='column'
      margin='0 auto'
      paddingTop='88px'
      maxW='480px'>
      <Flex width='100%'
        padding='20px'
        borderRadius='20px'
        backgroundColor='white'
        boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
        flexDirection='column'>
        <Flex width='100%'
          marginBottom='20px'
          justifyContent='space-between'>
          <Flex>
            <Avatar size={80}
              name={principalId}
              variant="marble" />
            <Flex marginLeft='20px'
              flexDirection='column'
              justifyContent='space-between'>
              <Text fontSize='24'
                lineHeight='28px'
                fontWeight='bold'>
                {name.length > 0 ? name[0] : 'Unnamed'}
              </Text>
              <Badge textTransform='lowercase'
                borderRadius='10px'
                fontSize='14px'
                fontWeight='regular'
                padding='0 10px'
                width='fit-content'>
                {shortPrincipal(principalId, 5, 3)}
              </Badge>
              <Text opacity='0.8' fontSize='14px' fontWeight='bold' lineHeight='16px'>
                {following.length}&nbsp;
                <span style={{ fontWeight: 'normal', opacity: '0.6' }}>Following</span>&nbsp;
                {followers.length}&nbsp;
                <span style={{ fontWeight: 'normal', opacity: '0.6' }}>Follower</span>
              </Text>
            </Flex>
          </Flex>
          <Flex height='32px' alignItems='center'>
            <a href={"https://" + reverseName + ".xyz"}>
              <Circle size='30px'
                border='1.5px solid #2663FF'>
                <IoMdLink color="#2663FF" size='18px' />
              </Circle>
            </a>&nbsp;&nbsp;
            <Button
              fontWeight='medium'
              colorScheme='regular'
              height='32px'>
              Follow
            </Button>
          </Flex>
        </Flex>
        <Text fontSize={14} opacity='0.6'>
          {bio}
        </Text>
      </Flex>
      <br />
      <EditField name='Name'
        placeholder={name.length > 0 ? name[0] : 'Not Set'} />
      <br />
      <EditField name='Bio'
        placeholder={bio.length > 0 ? bio[0] : 'Not Set'} />
      <br />
      {
        reverseName &&
        <Flex bgColor='white'
          borderRadius='20px'
          direction='column'
          width='100%'
          padding='20px'
          boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'>
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
            <a href={"https://" + reverseName + ".xyz"}>
              <Circle size='30px'
                marginRight='10px'
                border='1.5px solid #2663FF'
              >
                <IoMdLink color="#2663FF" size='18px' />
              </Circle>
            </a>
            <Input bgColor='#EDF2F7'
              disabled
              defaultValue={reverseName + '.xyz'}
              borderRadius='10px' />
          </Flex>
        </Flex>
      }
    </Flex>
  </>
}

interface IEdit extends InputProps {
  name: string
}
export const EditField: React.FC<IEdit> = ({ name, ...props }) => {

  const [edit, setEdit] = useState(false)
  const dfusionActor = useDfusionActor(Identity.caller ?? undefined);
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const dispatch = useAppDispatch()

  const handleSave = () => {
    setLoading(true)
    dfusionActor && dfusionActor.setUserInfo({
      name: name === 'Name' ? [input] : [],
      bio: name === 'Bio' ? [input] : []
    })
      .then((res) => {
        if ('ok' in res) {
          dispatch(
            name === 'Name' ?
              userExtAction.setName(input) :
              userExtAction.setBio(input)
          )
          toast({
            title: 'Set ' + name + ' Successfully!',
            status: 'success',
            duration: 3000
          })
        } else {
          toast({
            title: 'Failed to Set ' + name + '.',
            description: res.err.toString(),
            status: 'error',
            duration: 5000
          })
        }
      }).finally(() => {
        setLoading(false)
        setEdit(false)
      })
  }

  return <Flex bgColor='white'
    borderRadius='20px'
    direction='column'
    width='100%'
    padding='20px'
    boxShadow='0 0 10px rgba(0, 0, 0, 0.2)'
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
      value={input}
      onChange={(e) => {
        setInput(e.target.value)
      }}
      placeholder={props.placeholder}
      borderRadius='10px' />
    {edit &&
      <Button
        marginTop='10px'
        colorScheme='regular'
        isLoading={loading}
        onClick={() => {
          handleSave()
        }}
      > Save
      </Button>}
  </Flex>
}


export default SettingPage;