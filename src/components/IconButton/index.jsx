import React from 'react'
import { useNavigate } from 'react-router-dom'
import './iconButton.module.scss'
import { HiArrowLeft } from 'react-icons/hi2'
import {
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineMan,
  AiOutlineWoman,
} from 'react-icons/ai'

export default function IconButton({ kinds, onClick }) {
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
  }
  return (
    <>
      {kinds === 'back' && <HiArrowLeft onClick={goBack} />}
      {kinds === 'calendar' && <AiOutlineCalendar />}
      {kinds === 'close' && <AiOutlineClose />}
      {kinds === 'minus' && <AiOutlineMinus />}
      {kinds === 'plus ' && <AiOutlinePlus />}
      {kinds === 'man' && <AiOutlineMan />}
      {kinds === 'woman' && <AiOutlineWoman />}
    </>
  )
}