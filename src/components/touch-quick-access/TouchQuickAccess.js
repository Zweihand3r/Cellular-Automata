import React from 'react'
import BrushToggle from './BrushToggle'
import RadialMenu from './RadialMenu'
import ShapeMenu from './ShapeMenu'
import TqaRules from './TqaRules'

import './touch-quick-access.css'

const TouchQuickAccess = ({ 
  isMenu, isEraser, isCustomRules, modeIndex, dirIndex, touchTrigger, activeRule,
  onEraserToggle, onClear, onFillSelect, onRuleSelect, onTempPause 
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

      <TqaRules
        isCustomRules={isCustomRules}
        activeRule={activeRule}
        onSelect={onRuleSelect}
      />

      <ShapeMenu 
        modeIndex={modeIndex}
        dir={touchTrigger.dir}
        trig={touchTrigger.trig}
        onFillSelect={onFillSelect}
        onSliding={onTempPause}
      />
    </div>
  )
}

export default TouchQuickAccess