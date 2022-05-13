import React, { useState, useContext } from 'react'
import TouchReceiver from '../receivers/TouchReceiver'
import TouchQuickAccess from '../touch-quick-access/TouchQuickAccess'
import { NotificationContext } from '../../context/NotificationContext'
import { currBRl, currSRl, nextBRl, nextSRl, prevBRl, prevSRl } from '../../touch-controllers/rules-tc'
import { extendSeq, shortenSeq, nextSeq, prevSeq } from '../../touch-controllers/shades-tc'

import './controls.css'
import { NotificationWithBody } from '../notifications/notification-templates'

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
  {
    notification: (
      <NotificationWithBody
        title='Switched to Brush Mode'
        body='Swipe up menu disabled. Please select another mode to re-enable swipe up menu.'
      />
    ),
    triggerOffset: -1
  },
]

const TouchControls = ({ 
  onDraw, onErase, onClear, onBrushDownChange, 
  onRuleSelect, onShadesSelect, onFillSelect
 }) => {
  const { showNotification } = useContext(NotificationContext)

  const [isMenu, setIsMenu] = useState(false)
  const [isEraser, setIsEraser] = useState(false)
  const [modeIndex, setModeIndex] = useState(0)
  const [menuDirIndex, setMenuDirIndex] = useState(-2)
  const [triggerOffset, setTriggerOffset] = useState(5)
  const [touchTrigger, setTouchTrigger] = useState({ dir: -1, trig: 0 }) // dir same as menuDirIndex + 4 as tap & 5 as release

  let upTrigger, rightTrigger, downTrigger, leftTrigger

  const tap = () => {
    if (modeIndex === 2) {
      triggerTouch(4)
    }
  }

  const tapAndHold = () => {
    if (!isMenu) {
      setIsMenu(true)
      setTriggerOffset(25)

      // if menu opened onBrushDownChange(false) does not trigger
      if (modeIndex === 3) {
        onBrushDownChange(false)
      }
    }
  }

  const touch = (x, y) => {
    if (modeIndex === 3) {
      applyBrush(x, y)
      onBrushDownChange(true)
    }
  }

  const touchPointChange = (x, y) => {
    // only called on modeIndex === 3 atm
    applyBrush(x, y)
  }

  const release = () => {
    if (isMenu) {
      if (menuDirIndex > -1 && menuDirIndex !== modeIndex) {
        const { notification, triggerOffset } = MODES[menuDirIndex]
        if (menuDirIndex === 3 && isEraser) {
          setIsEraser(false)
        }

        setModeIndex(menuDirIndex)
        setTriggerOffset(triggerOffset)
        if (modeIndex === 3) {
          showNotification(
            <NotificationWithBody
              title={notification}
              body='Swipe up menu re-enabled'
            />
          )
        } else {
          showNotification(notification)
        }
      } else {
        setTriggerOffset(MODES[modeIndex].triggerOffset)
      }

      setIsMenu(false)
      setMenuDirIndex(-2)
    } else {
      if (modeIndex === 2) {
        triggerTouch(5)
      } else if (modeIndex === 3) {
        onBrushDownChange(false)
      }
    }
  }

  const triggerTouch = (dir) => {
    setTouchTrigger({ dir, trig: 1 - touchTrigger.trig })
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

  const applyDynamicShades = ({ name, step, shades }) => {
    onShadesSelect({ shades, isLoop: true })
    showNotification(`${name} ${step}`)
  }

  const applyBrush = (x, y) => {
    if (isEraser) {
      onErase(x, y)
    } else {
      onDraw(x, y)
    }
  }

  const toggleEraser = () => {
    setIsEraser(!isEraser)
    showNotification(`Switched to ${isEraser ? 'Brush' : 'Eraser'}`) // bc isEraser still prev value at this point
  }

  const clear = () => {
    showNotification('Grid cleared')
    onClear()
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
    } else if (modeIndex === 2) {
      upTrigger = () => triggerTouch(0)
      rightTrigger = () => triggerTouch(1)
      downTrigger = () => triggerTouch(2)
      leftTrigger = () => triggerTouch(3)
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
        isEraser={isEraser}
        modeIndex={modeIndex}
        dirIndex={menuDirIndex}
        touchTrigger={touchTrigger}
        onEraserToggle={toggleEraser}
        onClear={clear}
        onFillSelect={onFillSelect}
      />

      <TouchReceiver
        triggerOffset={triggerOffset}
        isTouchOverride={modeIndex === 3 && !isMenu}
        onTap={tap}
        onTapAndHold={tapAndHold}
        onTouch={touch}
        onTouchPointChange={touchPointChange}
        onRelease={release}
        onUpTrigger={upTrigger}
        onRightTrigger={rightTrigger}
        onDownTrigger={downTrigger}
        onLeftTrigger={leftTrigger}
      />
    </div>
  )
}

export default TouchControls