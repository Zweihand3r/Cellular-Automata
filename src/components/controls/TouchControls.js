import React, { useState, useContext } from 'react'
import { NotificationContext } from '../../context/NotificationContext'
import TouchReceiver from '../receivers/TouchReceiver'
import { currBRl, currSRl, nextBRl, nextSRl, prevBRl, prevSRl } from '../../touch-controllers/rules-tc'
import { extendSeq, shortenSeq, nextSeq, prevSeq } from '../../touch-controllers/shades-tc'

import './controls.css'

/**
 * Hold and Drag => Menu Options
 * Swipe left => Cancel (or back?)
 * MENU OPTIONS:
 * 1. Custom Rules on screen buttons
 * 2. Rule list
 * 3. Custom Pallete (This disables dynamic shades)
 *    a. Option to edit dynamic shades and add new ones
 * 4. Fills / Patterns => Maybe a horizonal swipable menu for this
 * 5. Brush On/Off
 * 6. Settings => For stuff like speed, grid size, wrap grid, yada yada
 * 7. Play / Pause
 */

const TouchControls = ({ onRuleSelect, onShadesSelect }) => {
  const { showNotification } = useContext(NotificationContext)

  const [isRuleMode, setIsRuleMode] = useState(true)

  let upTrigger, rightTrigger, downTrigger, leftTrigger

  const switchMode = () => {
    if (isRuleMode) {
      setIsRuleMode(false)
      showNotification("Switched to color mode")
    } else {
      setIsRuleMode(true)
      showNotification("Swithced to rule mode")
    }
  }
  
  const applyDynamicRule = (b, s) => {
    onRuleSelect({ b, s })
    showNotification(`B${b} S${s}`)
  }

  const applyDynamicShades = ({ name, step, shades}) => {
    console.log(shades)
    onShadesSelect({ shades, isLoop: true })
    showNotification(`${name} ${step}`)
  }

  if (isRuleMode) {
    upTrigger = () => applyDynamicRule(prevBRl(), currSRl())
    rightTrigger = () => applyDynamicRule(currBRl(), nextSRl())
    downTrigger = () => applyDynamicRule(nextBRl(), currSRl())
    leftTrigger = () => applyDynamicRule(currBRl(), prevSRl())
  } else {
    upTrigger = () => applyDynamicShades(extendSeq())
    rightTrigger = () => applyDynamicShades(nextSeq())
    downTrigger = () => applyDynamicShades(shortenSeq())
    leftTrigger = () => applyDynamicShades(prevSeq())
  }

  return (
    <div className='controls-base'>
      <TouchReceiver 
        onTap={switchMode}
        onTapAndHold={_=> console.log("TapAndHold!")}
        onUpTrigger={upTrigger}
        onRightTrigger={rightTrigger}
        onDownTrigger={downTrigger}
        onLeftTrigger={leftTrigger}
      />
    </div>
  )
}

export default TouchControls