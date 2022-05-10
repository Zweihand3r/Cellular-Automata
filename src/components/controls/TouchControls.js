import React, { useState, useContext } from 'react'
import TouchReceiver from '../receivers/TouchReceiver'
import TouchQuickAccess from '../touch-quick-access/TouchQuickAccess'
import { NotificationContext } from '../../context/NotificationContext'
import { currBRl, currSRl, nextBRl, nextSRl, prevBRl, prevSRl } from '../../touch-controllers/rules-tc'
import { extendSeq, shortenSeq, nextSeq, prevSeq } from '../../touch-controllers/shades-tc'

import './controls.css'

/**
 * Hold and Drag (upper 80% of screen) => QUICK OPTIONS 
 * 1. Customisable up right down left options activate on release
 * 2. Dynamic Rules, Brush, Fills, Dynamic colors
 * 3. On tap bring thier respective menus => Custom Rules, Brush/Eraser, Customise fill, Age Based Palette
 * 
 * Swipe up from bottom 20% of screen (other than brush mode)
 * MENU OPTIONS => grid size, wrap grid, full screen
 * 
 * Tap on lower 20% of screen - Play/Pause
 * Swipe left/right on lower 20% of screen for sim speed
 */

/* 
 * menuDirIndex:
 *    0
 * 3 -1  1
 *    2
 */

const MODES = [
  { notification: 'Switched to Color Mode', triggerOffset: 5 },
  { notification: 'Switched to Rule Mode', triggerOffset: 5 },
  { notification: 'Switched to Fill Mode', triggerOffset: 5 },
  { notification: 'Switched to Brush Mode', triggerOffset: -1 },
]

const TouchControls = ({ onRuleSelect, onShadesSelect }) => {
  const { showNotification } = useContext(NotificationContext)

  const [isMenu, setIsMenu] = useState(false)
  const [modeIndex, setModeIndex] = useState(0)
  const [menuDirIndex, setMenuDirIndex] = useState(-2)
  const [triggerOffset, setTriggerOffset] = useState(5)

  let upTrigger, rightTrigger, downTrigger, leftTrigger

  const tap = () => {
    
  }

  const tapAndHold = () => {
    if (!isMenu) {
      setIsMenu(true)
      setTriggerOffset(25)
    } 
  }

  const release = () => {
    if (isMenu) {
      if (menuDirIndex > -1) {
        const { notification, triggerOffset } = MODES[menuDirIndex]
        setModeIndex(menuDirIndex)
        setTriggerOffset(triggerOffset)
        showNotification(notification)
      } else {
        setTriggerOffset(MODES[modeIndex].triggerOffset)
      }
  
      setIsMenu(false)
      setMenuDirIndex(-2)
    }
  }

  const applyMenuDirection = (di, odi) => {
    if (menuDirIndex === odi) {
      setMenuDirIndex(-1)
    } else if (menuDirIndex !== di) {
      setMenuDirIndex(di)
    }
  }
  
  const applyDynamicRule = (b, s) => {
    onRuleSelect({ b, s })
    showNotification(`B${b} S${s}`)
  }

  const applyDynamicShades = ({ name, step, shades}) => {
    onShadesSelect({ shades, isLoop: true })
    showNotification(`${name} ${step}`)
  }

  if (isMenu) {
    upTrigger = () => applyMenuDirection(0, 2)
    rightTrigger = () => applyMenuDirection(1, 3)
    downTrigger = () => applyMenuDirection(2, 0)
    leftTrigger = () => applyMenuDirection(3, 1)
  } else {
    if (modeIndex === 0) {
      upTrigger = () => applyDynamicShades(extendSeq())
      rightTrigger = () => applyDynamicShades(nextSeq())
      downTrigger = () => applyDynamicShades(shortenSeq())
      leftTrigger = () => applyDynamicShades(prevSeq())
    } else if (modeIndex === 1) {
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
  }
  

  return (
    <div className='controls-base'>
      <TouchQuickAccess 
        isMenu={isMenu}
        modeIndex={modeIndex}
        dirIndex={menuDirIndex}
      />

      <TouchReceiver 
        triggerOffset={triggerOffset}
        onTap={tap}
        onTapAndHold={tapAndHold}
        onUpTrigger={upTrigger}
        onRightTrigger={rightTrigger}
        onDownTrigger={downTrigger}
        onLeftTrigger={leftTrigger}
        onRelease={release}
      />
    </div>
  )
}

export default TouchControls