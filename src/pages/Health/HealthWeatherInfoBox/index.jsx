import React, { memo, useEffect, useState } from 'react'
import WeatherSubInfo from './WeatherSubInfo'
import $ from './healthWeatherInfoBox.module.scss'
import classNames from 'classnames/bind'
import IconButton from '@components/IconButton'
import Flex from '@components/Flex'

const cx = classNames.bind($)
function HealthWeatherInfoBox({ data }) {
  const [isWeather, setIsWeather] = useState('')
  const [isIcon, setIsIcon] = useState('')
  const [weatherText, setWeatherText] = useState([])
  // 현재온도, 습도, 체감온도
  const { temp, humidity, feels_like } = data.main
  // 현재 날씨, 날씨 설명, 아이콘
  const { main, description, icon } = data.weather[0]
  // 	[°C] = [K] − 273.15 섭씨온도 만들기
  const WEATHER_STANDARD = 273.15
  const WHATHER_LIST = [
    {
      id: 1,
      title: '체감온도',
      data: `${Math.round(feels_like - WEATHER_STANDARD)}°`,
    },
    {
      id: 2,
      title: '습도',
      data: `${humidity}%`,
    },
    {
      id: 3,
      title: '바람',
      data: `${Math.round(data.wind.speed)}m/s`,
    },
  ]

  const checkIcon = () => {
    if (icon === '01d') {
      setIsIcon('sun')
      return
    }
    if (icon === '01n') {
      setIsIcon('moon')
      return
    }
    if (icon === '02d') {
      setIsIcon('cloudSun')
      return
    }
    if (icon === '02n') {
      setIsIcon('cloudMoon')
      return
    }
    if (icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n') {
      setIsIcon('clouds')
      return
    }
    if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n') {
      setIsIcon('rain')
      return
    }
    if (icon === '11d' || icon === '11n') {
      setIsIcon('lightning')
      return
    }
    if (icon === '13d' || icon === '13d') {
      setIsIcon('snow')
      return
    }
    if (icon === '50d' || icon === '50n') {
      setIsIcon('fog')
      return
    }
  }
  const checkWeather = (temp) => {
    if (description.indexOf('rain') >= 0 || description.indexOf('snow') >= 0) {
      setIsWeather('rain_or_snow')
      setWeatherText([
        '오늘은 야외 운동보다는 실내운동을',
        '추천합니다! 헬스 또는 홈트레이닝 추천!',
      ])
      return
    }
    if (temp < 0) {
      setIsWeather('cold')
      setWeatherText(['오늘은 운동하기에는 추워요.', '보온에 신경쓰시고, 실내운동을 추천해요!'])
      return
    }
    if (temp >= 0 && temp <= 15) {
      setIsWeather('warm_up')
      setWeatherText(['날씨가 쌀쌀해요.', '충분한 워밍업 후 운동하세요!'])
      return
    }
    if (temp >= 16 && temp <= 25) {
      setIsWeather('good')
      setWeatherText(['운동하기 너무 좋은 날씨입니다.', '오늘은 야외 운동을 추천해요!'])
      return
    }
    if (temp >= 26) {
      setIsWeather('hot')
      setWeatherText([
        '너무 더워요. 평소 운동 강도보다 낮추거나,',
        '아침운동 또는 저녁운동을 추천해요!',
      ])
      return
    }
  }

  useEffect(() => {
    const tempCheck = Math.round(temp - WEATHER_STANDARD)
    checkIcon()
    checkWeather(tempCheck)
  }, [])

  return (
    <article className={cx(isWeather)}>
      <Flex column>
        <Flex between padding width>
          <Flex column order2>
            <h2 className="blind">오늘의 날씨</h2>
            <IconButton kinds={isIcon} />
            <p className={$.weather_title}>{main}</p>
          </Flex>
          <Flex column start order1>
            <h3 className={$.temp}>
              <span className="blind">현재 온도</span>
              {Math.round(temp - WEATHER_STANDARD)}°
            </h3>
            <p>{weatherText[0]}</p>
            <p>{weatherText[1]}</p>
          </Flex>
        </Flex>
      </Flex>

      <ul className={$.sub_info}>
        {WHATHER_LIST.map((v) => (
          <WeatherSubInfo weather={v} key={v.id} />
        ))}
      </ul>
    </article>
  )
}
export default memo(HealthWeatherInfoBox)
