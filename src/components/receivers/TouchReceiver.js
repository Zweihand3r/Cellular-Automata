import React, { useContext } from 'react'
import { NotificationContext } from '../../context/NotificationContext'
import { currBRl, currSRl, nextBRl, nextSRl, prevBRl, prevSRl } from '../../utils/dynamic-rules'
import { RuleNotification } from '../notifications/Notifications'

const TRIGGER_OFFSET = 5

let sx = 0, sy = 0, xi = 0, yi = 0

const TouchReceiver = ({ onDynamicRule }) => {
  const { showNotification } = useContext(NotificationContext)

  const upTrigger = dy => {
    const b = prevBRl()
    const s = currSRl()
    onDynamicRule({ b, s })
    showNotification(<RuleNotification b={b} s={s} highlightS={false} />)
  }

  const rightTrigger = dx => {
    const b = currBRl()
    const s = nextSRl()
    onDynamicRule({ b, s })
    showNotification(<RuleNotification b={b} s={s} highlightS={true} />)
  }

  const downTrigger = dy => {
    const b = nextBRl()
    const s = currSRl()
    onDynamicRule({ b, s })
    showNotification(<RuleNotification b={b} s={s} highlightS={false} />)
  }

  const leftTrigger = dx => {
    const b = currBRl()
    const s = prevSRl()
    onDynamicRule({ b, s })
    showNotification(<RuleNotification b={b} s={s} highlightS={true} />)
  }

  const touchStart = e => {
    sx = e.touches[0].clientX
    sy = e.touches[0].clientY
  }

  const touchMove = e => {
    const dx = e.touches[0].clientX - sx
    const dy = e.touches[0].clientY - sy
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)
    sx = e.touches[0].clientX
    sy = e.touches[0].clientY

    if (adx > ady) {
      xi += adx
      if (yi) {
        yi = 0
      }
    } else {
      yi += ady
      if (xi) {
        xi = 0
      }
    }
    if (xi > TRIGGER_OFFSET) {
      if (dx > 0) {
        rightTrigger(dx)
      } else {
        leftTrigger(dx)
      }
      xi = 0
    }
    if (yi > TRIGGER_OFFSET) {
      if (dy > 0) {
        downTrigger(dy)
      } else {
        upTrigger(dy)
      }
      yi = 0
    }
  }

  const touchEnd = e => {
    xi = 0
    yi = 0
  }

  return (
    <div 
      className='receiver'
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onTouchCancel={touchEnd}
    />
  )
}

export default TouchReceiver