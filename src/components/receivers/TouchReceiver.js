import React from 'react'

const TRIGGER_OFFSET = 5

let sx = 0, sy = 0, xi = 0, yi = 0

const TouchReceiver = ({ onTap, onUpTrigger, onRightTrigger, onDownTrigger, onLeftTrigger }) => {
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
        onRightTrigger(dx)
      } else {
        onLeftTrigger(dx)
      }
      xi = 0
    }
    if (yi > TRIGGER_OFFSET) {
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