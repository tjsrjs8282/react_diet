import React from 'react'
import Input from '@components/Input'
import IconButton from '@components/IconButton'
import './inputSearch.scss'

export default function InputSearch({ type, name, value, placeholder, inputRef, onChange, onClick }) {
  return (
    <form className="search_box">
      <IconButton kinds={'search'} />
      <Input {...{ type, name, value, inputRef, placeholder, onChange }} />
      {value && <IconButton kinds={'closeCircle'} onClick={onClick} />}
    </form>
  )
}
