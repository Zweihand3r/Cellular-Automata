import React from 'react'

const TAP_AND_HOLD_INTERVAL = 480

let sx = 0, sy = 0, xi = 0, yi = 0, longPressTimeout = null

const TouchReceiver = ({ 
  triggerOffset, isTouchOverride,
  onTap, onTapAndHold, onRelease, onTouchChange,
  onUpTrigger, onRightTrigger, onDownTrigger, onLeftTrigger 
}) => {
  const touchStart = e => {
    sx = e.touches[0].clientX
    sy = e.touches[0].clientY
    longPressTimeout = setTimeout(() => {
      if (
        Math.abs(e.touches[0].clientX - sx) < 5 &&
        Math.abs(e.touches[0].clientY - sy) < 5
      ) {
        onTapAndHold()
        longPressTimeout = null
      }
    }, TAP_AND_HOLD_INTERVAL)

    if (isTouchOverride) {
      onTouchChange(sx, sy)
    }
  }

  const touchMove = e => {
    if (isTouchOverride) {
      sx = e.touches[0].clientX
      sy = e.touches[0].clientY
      
      onTouchChange(e.touches[0].clientX, e.touches[0].clientY)
      return
    }

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
    if (xi > triggerOffset) {
      if (dx > 0) {
        onRightTrigger(dx)
      } else {
        onLeftTrigger(dx)
      }
      xi = 0
    }
    if (yi > triggerOffset) {
      if (dy > 0) {
        onDownTrigger(dy)
      } else {
        onUpTrigger(dy)
      }
      yi = 0
    }
  }

  const touchEnd = e => {
    xi = 0
    yi = 0
    clearLongPressTimeout()
    onRelease()
  }

  const clearLongPressTimeout = () => {
    if (longPressTimeout) {
      clearInterval(longPressTimeout)
      longPressTimeout = null
    }
  }

  return (
    <div 
      className='receiver'
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onTouchCancel={touchEnd}
      onClick={onTap}
      onContextMenu={e => e.preventDefault()}
    />
  )
}

export default TouchReceiver