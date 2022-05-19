import React from 'react'

const TAP_AND_HOLD_INTERVAL = 480

let sx = 0, sy = 0, lx = 0, ly = 0, xi = 0, yi = 0
let longPressTimeout = null, swipeUpStart = 0

const TouchReceiver = ({ 
  triggerOffset, isTouchOverride,
  onTap, onTapAndHold, onTouch, onTouchPointChange, onRelease,
  onUpTrigger, onRightTrigger, onDownTrigger, onLeftTrigger,
  onSwipeUp 
}) => {
  const touchStart = e => {
    sx = e.touches[0].clientX
    sy = e.touches[0].clientY
    lx = sx
    ly = sy
    longPressTimeout = setTimeout(() => {
      if (Math.abs(sx - lx) < 5 && Math.abs(sy - ly) < 5) {
        onTapAndHold()
        longPressTimeout = null
      }
    }, TAP_AND_HOLD_INTERVAL)
    
    onTouch(lx, ly)

    if (!isTouchOverride && ly > window.innerHeight * .85) {
      swipeUpStart = Date.now()
    }
  }

  const touchMove = e => {
    if (isTouchOverride) {
      lx = e.touches[0].clientX
      ly = e.touches[0].clientY
      
      onTouchPointChange(e.touches[0].clientX, e.touches[0].clientY)
      return
    }

    const dx = e.touches[0].clientX - lx
    const dy = e.touches[0].clientY - ly
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)
    lx = e.touches[0].clientX
    ly = e.touches[0].clientY

    if (adx > ady) {
      xi += adx * ady
      if (yi && xi > triggerOffset / 2) {
        yi = 0
      }
    } else {
      yi += ady * ady
      if (xi && yi > triggerOffset / 2) {
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

    if (!isTouchOverride && swipeUpStart) {
      const ady = Math.abs(sy - ly)
      const timeElapsed = Date.now() - swipeUpStart

      if (ady > 120 && timeElapsed < 240) {
        onSwipeUp()
      }

      swipeUpStart = 0
    }
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