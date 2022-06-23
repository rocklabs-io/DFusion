import {
  Icon, Input, InputGroup,
  InputLeftElement, InputRightElement,
  Button, Text
} from "@chakra-ui/react"
import { useState } from "react"
import { MdSearch } from 'react-icons/md'
import { useNavigate } from "react-router-dom"

export const SearchBar = () => {

  const navigate = useNavigate()
  const [text, setText] = useState('')
  const handleSearch = () => {
    if (text) navigate('/search/'+text)
  }

  return <InputGroup mr='4px'>
    <InputLeftElement children={
      <Icon as={MdSearch} ml='2' boxSize='24px' color='gray.300' />
    } />
    <Input borderRadius={20}
    onKeyDown={(e)=>{
      if (e.key === 'Enter')
        handleSearch()
    }}
    onChange={(e) => {
      setText(e.target.value)
    }} />
    <InputRightElement width='4.5rem'>
      <Button variant='ghost'
        height='28px'
        fontWeight='regular'
        color='gray.500'
        mr='1'
        value={text}
        borderRadius='0 16px 16px 0'
        borderLeft='1px solid #E5E5E5'
        disabled={!text}
        onClick={handleSearch}
      >Search</Button>
    </InputRightElement>
  </InputGroup>
} 