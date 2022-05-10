import React from 'react'
import { RiBrushFill, RiEraserFill } from 'react-icons/ri'

const BrushToggle = ({ isEraser, onToggle }) => {
  const click = e => {
    onToggle()
    e.stopPropagation()
  }

  return (
    <div className='bt-root' onClick={click}>
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