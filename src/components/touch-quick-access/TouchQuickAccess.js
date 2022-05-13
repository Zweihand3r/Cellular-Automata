import React from 'react'
import BrushToggle from './BrushToggle'
import RadialMenu from './RadialMenu'
import ShapeMenu from './ShapeMenu'

import './touch-quick-access.css'

const TouchQuickAccess = ({ 
  isMenu, isEraser, modeIndex, dirIndex, touchTrigger,
  onEraserToggle, onClear, onFillSelect 
}) => {
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
          onClear={onClear}
        />
      )}

      <ShapeMenu 
        modeIndex={modeIndex}
        dir={touchTrigger.dir}
        trig={touchTrigger.trig}
        onFillSelect={onFillSelect}
      />
    </div>
  )
}

export default TouchQuickAccess