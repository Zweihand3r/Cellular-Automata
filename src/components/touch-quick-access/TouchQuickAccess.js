import React, { useState, useEffect } from 'react'
import BrushToggle from './BrushToggle'
import RadialMenu from './RadialMenu'

import './touch-quick-access.css'

const TouchQuickAccess = ({ isMenu, isEraser, modeIndex, dirIndex, onEraserToggle }) => {
  return (
    <div className='tqa-root'>
      <RadialMenu 
        isMenu={isMenu} 
        modeIndex={modeIndex}
        dirIndex={dirIndex}
      />

      {modeIndex === 3 && (
        <BrushToggle 
          isEraser={isEraser}
          onToggle={onEraserToggle}
        />
      )}
    </div>
  )
}

export default TouchQuickAccess