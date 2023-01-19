import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import $ from './perposeList.module.scss'
import Wrapper from '@components/Wrapper'
import Header from '@components/Header'
import IconButton from '@components/IconButton'
import Title from '@components/Title'
import Button from '@components/Button'
import RadioGroup from '@components/RadioGroup'
import Radio from '@components/Radio'
import { AiFillCheckCircle } from 'react-icons/ai'
import { USER_GOALS } from './constants'

export default function UserPurpose() {
  const navigate = useNavigate()
  const [purpose, setPurpose] = useState('maintain')

  const handleOnClick = () => {
    localStorage.removeItem('userPurpose')
    localStorage.setItem('userPurpose', JSON.stringify(purpose))

    navigate('/today')
  }

  return (
    <Wrapper>
      <Header>
        <IconButton kinds="back" />
      </Header>
      <Title
        content="귀하의 식단 목표를
          설정해 주세요."
      />
      <RadioGroup label="purpose" value={purpose} onChange={setPurpose}>
        {USER_GOALS.map((goal) => {
          const { value, description, title, id } = goal
          return (
            <Radio name="purpose" value={value} key={id}>
              <div className={$.purpose_icon}>
                <AiFillCheckCircle />
              </div>
              <p>{description}</p>
              <h3>{title}</h3>
            </Radio>
          )
        })}
      </RadioGroup>
      <Button content="확인" link="/today" onClick={handleOnClick} />
    </Wrapper>
  )
}
