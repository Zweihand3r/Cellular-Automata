import React, { useState, useContext } from 'react'
import TouchReceiver from '../receivers/TouchReceiver'
import { currBRl, currSRl, nextBRl, nextSRl, prevBRl, prevSRl } from '../../touch-controllers/rules-tctrl'
import { NotificationContext } from '../../context/NotificationContext'

import './controls.css'

const TouchControls = ({ onRuleSelect }) => {
  const { showNotification } = useContext(NotificationContext)

  const [isRuleMode, setIsRuleMode] = useState(true)

  let upTrigger, rightTrigger, downTrigger, leftTrigger

  const switchMode = () => {
    // if (isRuleMode) {
    //   setIsRuleMode(false)
    //   showNotification("Switched to color mode")
    // } else {
    //   setIsRuleMode(true)
    //   showNotification("Swithced to rule mode")
    // }
  }
  
  const applyDynamicRule = (b, s) => {
    onRuleSelect({ b, s })
    showNotification(`B${b} S${s}`)
  }

  if (isRuleMode) {
    upTrigger = () => applyDynamicRule(prevBRl(), currSRl())
    rightTrigger = () => applyDynamicRule(currBRl(), nextSRl())
    downTrigger = () => applyDynamicRule(nextBRl(), currSRl())
    leftTrigger = () => applyDynamicRule(currBRl(), prevSRl())
  } else {
    upTrigger = () => {}
    rightTrigger = () => {}
    downTrigger = () => {}
    leftTrigger = () => {}
  }

  return (
    <div className='controls-base'>
      <TouchReceiver 
        onTap={switchMode}
        onUpTrigger={upTrigger}
        onRightTrigger={rightTrigger}
        onDownTrigger={downTrigger}
        onLeftTrigger={leftTrigger}
      />
    </div>
  )
}

export default TouchControls