import React, { useEffect, useState } from 'react'
import { GiResize } from "react-icons/gi"
import './Resizer.css'

const COUNTDOWN_MAX = 1
let timer

const Resizer = ({ isResizing, onResizing }) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_MAX)

  useEffect(() => {
    const resizeHandler = () => {
      onResizing(true)
      setCountdown(COUNTDOWN_MAX)

      if (timer) {
        clearInterval(timer)
      }

      timer = setInterval(() => {
        setCountdown(p => p - 1)
      }, 1000)
    }

    window.addEventListener("resize", resizeHandler)
    return () => window.removeEventListener("resize", resizeHandler)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      clearInterval(timer)
      timer = null
      onResizing(false)
    }
  }, [countdown])

  if (isResizing) {
    return (
      <div className='resizer-base fill'>
        <GiResize className='resizer-icon center' />
      </div>
    )
  } else {
    return null
  }
}

export default Resizer
