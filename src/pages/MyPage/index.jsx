import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { localStorageService } from '@utils/localStorage.service'
import { useRecoilState } from 'recoil'
import { themeState, dateState } from '@store'
import { LOCAL_STORAGE_KEY } from '@constants'
import $ from './myPage.module.scss'
import ImageMan from '@assets/man.svg'
import ImageWoman from '@assets/woman.svg'
import IconPurpose from '@assets/ic-purpose-white.png'
import Wrapper from '@components/Wrapper'
import Header from '@components/Header'
import Flex from '@components/Flex'
import IconButton from '@components/IconButton'
import FloatMenu from '@components/FloatMenu'
import Title from '@components/Title'
import Button from '@components/Button'
import Calendar from 'react-calendar'
import dayjs from 'dayjs'
import Modal from '@components/Modal'
import RadioGroup from '@components/RadioGroup'
import Radio from '@components/Radio'
import { INTAKE_TOTAL } from './constants'

export default function MyPage() {
  const [dateRecoil, setDateRecoil] = useRecoilState(dateState)
  const [userInfo, setUserInfo] = useState({})
  const [userGender, setUserGender] = useState()
  const [userPurpose, setUserPurpose] = useState()
  const [theme, setTheme] = useRecoilState(themeState)
  const [checked, setChecked] = useState(theme === 'DARK' ? true : false)
  const [toggleIcon, setToggleIcon] = useState(theme === 'DARK' ? 'moon' : 'sun')
  const [foodMark, setFoodMark] = useState([])
  const [healthMark, setHealthMark] = useState([])
  const [monthRecord, setMonthRecord] = useState('food')
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')

  const sessionFoodTotal = localStorageService().get('FOOD_TOTAL')
  const sessionHealthTotal = localStorageService().get('HEALTH_TOTAL')
  const WEEKS = ['일', '월', '화', '수', '목', '금', '토']

  const [modalRemove, setModalRemove] = useState(false)
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  const goUserPurpose = () => {
    navigate('/purpose')
  }

  const goUserInfo = () => {
    navigate('/start')
  }

  const onClickDayHandler = (date) => {
    setDateRecoil(date)
  }

  const handleChangeTheme = useCallback(
    (e) => {
      if (e.target.checked === false) {
        setChecked(e.target.checked)
        setToggleIcon('sun')
        localStorageService().set('THEME', 'LIGHT')
        document.documentElement.setAttribute('data-theme', 'LIGHT')
        setTheme('LIGHT')
        return
      }
      setChecked(e.target.checked)
      setToggleIcon('moon')
      localStorageService().set('THEME', 'DARK')
      document.documentElement.setAttribute('data-theme', 'DARK')
      setTheme('DARK')
    },
    [theme, checked]
  )

  const monthFilter = () => {
    const foodDateMark = sessionFoodTotal ? sessionFoodTotal.map((data) => data.date) : []
    const healthDateMark = sessionHealthTotal ? sessionHealthTotal.map((data) => data.date) : []
    setFoodMark([...new Set(foodDateMark)])
    setHealthMark([...new Set(healthDateMark)])
  }

  const onClickRemoveHandler = () => {
    setModalTitle(`데이터 초기화`)
    setModalContent(`모든 기록일지를 초기화 하시겠습니까?`)
    setModalRemove(!modalRemove)
  }

  const modalRemoveOnClick = () => {
    localStorageService().remove(LOCAL_STORAGE_KEY.USER_INFO)
    localStorageService().remove(LOCAL_STORAGE_KEY.USER_GENDER)
    localStorageService().remove(LOCAL_STORAGE_KEY.USER_PURPOSE)
    localStorageService().remove('FOOD_TOTAL')
    localStorageService().remove('HEALTH_TOTAL')
    localStorageService().remove('DATE')
    localStorageService().remove('PART')
    navigate('/')
  }

  const modalOnClose = () => {
    setModalRemove(false)
  }

  useEffect(() => {
    const info = localStorageService().get(LOCAL_STORAGE_KEY.USER_INFO)
    setUserGender(localStorageService().get(LOCAL_STORAGE_KEY.USER_GENDER))
    setUserPurpose(localStorageService().get(LOCAL_STORAGE_KEY.USER_PURPOSE))
    const { userName, userHeight, userOld, userWeight } = info
    setUserInfo({
      userName: userName,
      userHeight: userHeight + 'cm',
      userOld: userOld + '살',
      userWeight: userWeight + 'kg',
    })
    monthFilter()
  }, [])

  return (
    <Wrapper colorGray>
      {modalRemove && (
        <Modal
          title={modalTitle}
          content={modalContent}
          onClick={modalRemoveOnClick}
          onClose={modalOnClose}
          confirm
        ></Modal>
      )}
      <Header>
        <Flex width between>
          <IconButton kinds="back" onClick={goBack} />
          <label className={$.switch_wrapper}>
            <input
              type="checkbox"
              checked={checked}
              className="blind"
              onChange={(e) => handleChangeTheme(e)}
            />
            <span className={$.switch}>
              <span className={$.switch_handler}>
                <IconButton kinds={toggleIcon} />
              </span>
            </span>
          </label>
        </Flex>
      </Header>

      <Flex width between marginTop>
        <Flex>
          <div className={$.profile}>
            <img src={userGender === 'man' ? ImageMan : ImageWoman} alt="프로필 사진" />
          </div>
          <div className={$.info_box}>
            <h2>{userInfo.userName}</h2>
            <ul className={$.info_list}>
              <li>{userGender === 'man' ? '남자' : '여자'}</li>
              {Object.values(userInfo)
                .filter((v) => v !== userInfo.userName)
                .map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
            </ul>
          </div>
        </Flex>
        <IconButton kinds="setting" onClick={goUserInfo} />
      </Flex>

      <Title content="나의 목표" sub />
      <div className={$.purpose_wrapper}>
        <Flex>
          <img src={IconPurpose} alt="목표 이미지" />
          <h3>{userPurpose}</h3>
        </Flex>
        <Button content="목표 수정" border colorWhite onClick={goUserPurpose} />
      </div>

      <Title content="하루 목표 섭취량" sub>
        <Button content="수정하기" none />
      </Title>
      <Flex width around radius shadow border colorWhite>
        {INTAKE_TOTAL.map((value) => {
          const { id, name, max, unit } = value
          return (
            <div key={id} className={$.intake_item}>
              <h4>{name}</h4>
              <span>{max + unit}</span>
            </div>
          )
        })}
      </Flex>

      <div className={$.mark_wrapper}>
        <Flex width between>
          <Title content="이달의 기록" sub />
          <RadioGroup label="record" value={monthRecord} onChange={setMonthRecord}>
            <Radio name="food" value={'food'} tab>
              <p>식단</p>
            </Radio>
            <Radio name="health" value={'health'} tab>
              <p>운동</p>
            </Radio>
          </RadioGroup>
        </Flex>
      </div>
      <Calendar
        onChange={setDateRecoil}
        value={dateRecoil}
        className={'mypage'}
        onClickDay={(date) => onClickDayHandler(date)}
        tileClassName={({ date }) => {
          const monthMark = monthRecord === 'food' ? foodMark : healthMark
          if (
            monthMark.find(
              (x) => x === dayjs(date).format(`MM월 DD일 ${WEEKS[dayjs(date).get('d')]}요일`)
            )
          ) {
            return 'highlight'
          }
        }}
      />

      <div className={$.logout}>
        <Title content=" " sub>
          <Button content="데이터 초기화" none onClick={onClickRemoveHandler} />
        </Title>
      </div>

      <FloatMenu />
    </Wrapper>
  )
}
