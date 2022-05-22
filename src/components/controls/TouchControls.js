import React, { useState, useContext } from 'react'
import TouchReceiver from '../receivers/TouchReceiver'
import TouchQuickAccess from '../touch-quick-access/TouchQuickAccess'
import { NotificationContext } from '../../context/NotificationContext'
import { currBRl, currSRl, nextBRl, nextSRl, prevBRl, prevSRl } from '../../touch-controllers/rules-tc'
import { extendColorMod, shortenColorMod, nextSeq, prevSeq, switchColorSubMod } from '../../touch-controllers/shades-tc'

import './controls.css'
import { NotificationWithBody } from '../notifications/notification-templates'
import TouchOptions from '../touch-options/TouchOptions'

/**
 * [ ] Add dx, dy to trigger index in TouchReceiver not 1
 * [ ] Rule mode down / right cycle between zero rules and up / left cycle non-zero rules
 * [ ] ON TAP OF MODES
 *     [ ] Multihandle slider for color mode
 *     [ ] Custom rules panel
 *     [ ] Menu access by up chevron for further customisation. Maybe put all this to the right for more space
 * [ ] Some explaination regarding modes instead of notification (Can be toggles wiht tutorial or something independant of notifications)
 * [-] Color mode implement interval (pulse -> step size at loop end) apart from steps
 *     [x] Add similar menu for color mode as shape mode to cycle between the sub-modes
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

let arB = '3', arS = '23'

const TouchControls = ({ 
  altRender,
  onIsPlayingChanged,
  onDraw, onErase, onClear, onBrushDownChange, 
  onRuleSelect, onShadesSelect, onFillSelect,
  onShowFpsChange, onWrapChange, onAltRenderChange
 }) => {
  const { showNotification } = useContext(NotificationContext)

  const [isMenu, setIsMenu] = useState(false)
  const [isOptions, setIsOptions] = useState(false)
  const [isEraser, setIsEraser] = useState(false)
  const [isCustomRules, setIsCustomRules] = useState(false)
  const [modeIndex, setModeIndex] = useState(1)
  const [menuDirIndex, setMenuDirIndex] = useState(-2)
  const [triggerOffset, setTriggerOffset] = useState(5)
  const [touchTrigger, setTouchTrigger] = useState({ dir: -1, trig: 0 }) // dir same as menuDirIndex + 4 as tap & 5 as release
  const [activeRule, setActiveRule] = useState({ b: '3', s: '23' })

  let upTrigger, rightTrigger, downTrigger, leftTrigger

  const updateIsCustomRules = v => {
    if (v) {
      setActiveRule({ b: arB, s: arS })
    } else {
      arB = activeRule.b
      arS = activeRule.s
    }
    setIsCustomRules(v)
  }

  const tap = () => {
    if (modeIndex === 0) {
      const { notification } = switchColorSubMod()
      showNotification(notification)
    } else if (modeIndex === 1) {
      updateIsCustomRules(!isCustomRules)
    } else if (modeIndex === 2) {
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
        if (isCustomRules && menuDirIndex !== 1) {
          updateIsCustomRules(false)
        }
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

  const swipeUp = () => {
    setIsOptions(true)
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
    if (isCustomRules) {
      setActiveRule({ b, s })
    } else {
      arB = b
      arS = s
      showNotification(`B${b} S${s}`, 2)
    }
  }

  const applyDynamicShades = ({ shades, notification }) => {
    onShadesSelect({ shades, isLoop: true })
    showNotification(notification)
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

  const tempPause = (pause) => {
    onIsPlayingChanged(!pause)
  }

  const closeOptions = () => {
    setIsOptions(false)
  }

  if (isMenu) {
    upTrigger = () => applyMenuDirection(0, 2)
    rightTrigger = () => applyMenuDirection(1, 3)
    downTrigger = () => applyMenuDirection(2, 0)
    leftTrigger = () => applyMenuDirection(3, 1)
  } else {
    if (modeIndex === 0) {
      upTrigger = () => applyDynamicShades(extendColorMod())
      rightTrigger = () => applyDynamicShades(nextSeq())
      downTrigger = () => applyDynamicShades(shortenColorMod())
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
        isCustomRules={isCustomRules}
        modeIndex={modeIndex}
        dirIndex={menuDirIndex}
        touchTrigger={touchTrigger}
        activeRule={activeRule}
        onEraserToggle={toggleEraser}
        onClear={clear}
        onFillSelect={onFillSelect}
        onRuleSelect={applyDynamicRule}
        onTempPause={tempPause}
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
        onSwipeUp={swipeUp}
      />

      <TouchOptions 
        isOptions={isOptions}
        altRender={altRender}
        onShowFpsChange={onShowFpsChange}
        onWrapChange={onWrapChange}
        onAltRenderChange={onAltRenderChange}
        onClose={closeOptions}
      />
    </div>
  )
}

export default TouchControls