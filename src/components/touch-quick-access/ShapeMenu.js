import React, { useContext, useEffect, useState } from 'react'
import { TiChevronRight } from 'react-icons/ti'

import { DataContext } from '../../context/DataContext'
import { NotificationContext } from '../../context/NotificationContext'

let fi = 0, allArgValues = []

const ShapeMenu = ({ modeIndex, dir, trig, onFillSelect }) => {
  const { fillers } = useContext(DataContext)
  const { hideNotification } = useContext(NotificationContext)

  const [fill, setFill] = useState(fillers[fi])
  const [argValues, setArgValues] = useState([])
  const [argIndex, setArgIndex] = useState(0)
  const [stateIndex, setStateIndex] = useState(0)

  const [showLabel, setShowLabel] = useState(false)
  const [showSliders, setShowSliders] = useState(false)
  const [slidersOutPhase, setSlidersOutPhase] = useState(false)

  const applyFill = () => {
    onFillSelect(
      fillers[fi].fill,
      allArgValues[fi]
    )
    setFill(fillers[fi])
    setArgValues(allArgValues[fi])
  }

  const updateArg = (byVal) => {
    const val = argValues[argIndex]
    const newVal = Math.clamp(
      val + byVal,
      fill.config[argIndex].range[0],
      fill.config[argIndex].range[1]
    )
    if (newVal !== val) {
      setArgValues(argValues.map((v, i) => i === argIndex ? newVal : v))
    }
  }

  const animEnded = e => {
    if (e.animationName === 'fade-out-anim') {
      setShowSliders(false)
      setSlidersOutPhase(false)
    }
  }

  useEffect(() => {
    const upTrigger = () => {
      if (stateIndex < 2) {
        if (fi > 0) {
          fi -= 1
        } else {
          fi = fillers.length - 1
        }
        applyFill()
        resetStateIndex()
        if (!showLabel) {
          setShowLabel(true)
        }
        hideNotification()
      } else {
        if (argIndex > 0) {
          setArgIndex(pv => pv - 1)
        }
      }
    }

    const rightTrigger = () => {
      if (stateIndex === 0) {
        setStateIndex(1)
        if (!showLabel) {
          setShowLabel(true)
        }
        hideNotification()
      } else if (stateIndex === 2) {
        updateArg(1)
      }
    }

    const downTrigger = () => {
      if (stateIndex < 2) {
        if (fi < fillers.length - 1) {
          fi += 1
        } else {
          fi = 0
        }
        applyFill()
        resetStateIndex()
        if (!showLabel) {
          setShowLabel(true)
        }
        hideNotification()
      } else {
        if (argIndex < argValues.length - 1) {
          setArgIndex(pv => pv + 1)
        }
      }
    }

    const leftTrigger = () => {
      if (stateIndex === 1) {
        setStateIndex(0)
      } else if (stateIndex === 2) {
        updateArg(-1)
      }
    }

    const tapTrigger = () => {
      if (stateIndex === 0) {
        applyFill()
      } else if (stateIndex === 2) {
        setStateIndex(0)
        setShowLabel(false)
        setSlidersOutPhase(true)
      }
    }

    const releaseTrigger = () => {
      if (stateIndex === 0) {
        if (showLabel) {
          setShowLabel(false)
        }
      } else if (stateIndex === 1) {
        setStateIndex(2)
        setShowSliders(true)
      }
    }

    const resetStateIndex = () => {
      if (stateIndex === 1) {
        setStateIndex(0)
      }
    }

    switch (dir) {
      case 0: upTrigger(); break
      case 1: rightTrigger(); break
      case 2: downTrigger(); break
      case 3: leftTrigger(); break
      case 4: tapTrigger(); break
      case 5: releaseTrigger(); break
      default: break
    }
  }, [trig])

  useEffect(() => {
    allArgValues = []
    fillers.forEach(({ config }) => {
      const args = []
      config.forEach(({ init }) => {
        args.push(init)
      })
      allArgValues.push(args)
    })
    setArgValues(allArgValues[0])
  }, [fillers])

  if (modeIndex !== 2) {
    return null
  }

  return (
    <div className='sm-root'>
      <div className={`sm-label-con ${showLabel && 'sm-lc-show'} ${showSliders && 'sm-lc-ex'}`}>
        <div className='sm-arrow' />
        <div className='sm-label'>
          {fill.name}
        </div>
        <TiChevronRight 
          className={`sm-arrow ${stateIndex === 1 && 'sm-arrow-vis'}`} 
        />
      </div>
      {showSliders && (
        <div 
          className={`sm-sliders-con ${slidersOutPhase && 'fade-out'}`}
          onAnimationEnd={animEnded}
        >
          <div className='sm-ss-bg' />

          <div className='sm-sliders'>
            {fill.config.map(({ name }, i) => (
              <div 
                key={i}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`sm-slider-con ${i === argIndex && 'sm-sc-highlight'}`}
              >
                <div>{name} ({argValues[i]})</div>
                <div className='sm-slider'>
                  <div 
                    className='sm-s-track'
                    style={{
                      width: `${Math.inverseLerp(
                        fill.config[i].range[0], 
                        fill.config[i].range[1], 
                        argValues[i]) * 100}%`
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ShapeMenu