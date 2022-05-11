import React from 'react'
import { RiBrushFill, RiEraserFill } from 'react-icons/ri'

let longPressTimeout = null

const BrushToggle = ({ isEraser, onToggle, onClear }) => {
  const click = e => {
    onToggle()
    e.stopPropagation()
  }

  const touchStart = () => {
    longPressTimeout = setTimeout(() => {
      onClear()
    }, 480);
  }

  const touchEnd = () => {
    if (longPressTimeout) {
      clearInterval(longPressTimeout)
      longPressTimeout = null
    }
  }

  return (
    <div 
      className='bt-root' 
      onClick={click}
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      onTouchCancel={touchEnd}
      onContextMenu={e => e.preventDefault()}
    >
      <div className='bt-con'>
        {isEraser ? (
          <RiEraserFill className='bt-icon center' />
        ) : (
          <RiBrushFill className='bt-icon center' />
        )}
      </div>
    </div>
  )
}

export default BrushToggle