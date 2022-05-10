import React, { useState, useEffect } from 'react'

import { RiBrushFill, RiBrushLine, RiHeartPulseFill, RiHeartPulseLine } from 'react-icons/ri'
import { IoColorPalette, IoColorPaletteOutline, IoGrid, IoGridOutline } from 'react-icons/io5'
import { VscChevronUp, VscChevronRight, VscChevronDown, VscChevronLeft } from 'react-icons/vsc'

const RadialMenu = ({ isMenu, modeIndex, dirIndex }) => {
  const [show, setShow] = useState(false)
  const [outPhase, setOutPhase] = useState(false)

  const animEnded = e => {
    if (e.animationName === 'scale-out-anim') {
      setShow(false)
    }
  }

  useEffect(() => {
    if (isMenu) {
      setShow(true)

      if (outPhase) {
        setOutPhase(false)
      }
    } else {
      setOutPhase(true)
    }
  }, [isMenu])

  if (!show) return null

  return (
    <div
      className={`rm-root ${outPhase && 'scale-out'}`}
      onAnimationEnd={animEnded}
    >
      {/* BG ALSO CONTAINS ARROWS */}
      <div className='rm-bg' >

        {/* ARROWS */}
        <div className='rm-arrow-con arrow-up'>
          <VscChevronUp
            className={
              `rm-arrow ${dirIndex === -1 && 'collapsed'} ${dirIndex === 0 && 'highlight'}`
            }
          />
        </div>

        <div className='rm-arrow-con arrow-right'>
          <VscChevronRight
            className={
              `rm-arrow ${dirIndex === -1 && 'collapsed'} ${dirIndex === 1 && 'highlight'}`
            }
          />
        </div>

        <div className='rm-arrow-con arrow-down'>
          <VscChevronDown
            className={
              `rm-arrow ${dirIndex === -1 && 'collapsed'} ${dirIndex === 2 && 'highlight'}`
            }
          />
        </div>

        <div className='rm-arrow-con arrow-left'>
          <VscChevronLeft
            className={
              `rm-arrow ${dirIndex === -1 && 'collapsed'} ${dirIndex === 3 && 'highlight'}`
            }
          />
        </div>
      </div>

      {/* ICONS */}
      <div className='rm-item-con item-up'>
        {modeIndex === 0 ? (
          <IoColorPalette
            className={
              `rm-item rm-colors rm-rules center ${dirIndex === 0 && 'highlight'}`
            }
          />
        ) : (
          <IoColorPaletteOutline
            className={
              `rm-item rm-colors rm-rules center ${dirIndex === 0 && 'highlight'}`
            }
          />
        )}
      </div>

      <div className='rm-item-con item-right'>
        {modeIndex === 1 ? (
          <RiHeartPulseFill
            className={
              `rm-item rm-rules center ${dirIndex === 1 && 'highlight'}`
            }
          />
        ) : (
          <RiHeartPulseLine
            className={
              `rm-item rm-rules center ${dirIndex === 1 && 'highlight'}`
            }
          />
        )}
      </div>

      <div className='rm-item-con item-down'>
        {modeIndex === 2 ? (
          <IoGrid
            className={
              `rm-item rm-shapes center ${dirIndex === 2 && 'highlight'}`
            }
          />
        ) : (
          <IoGridOutline
            className={
              `rm-item rm-shapes center ${dirIndex === 2 && 'highlight'}`
            }
          />
        )}
      </div>

      <div className='rm-item-con item-left'>
        {modeIndex === 3 ? (
          <RiBrushFill
            className={
              `rm-item rm-draw center ${dirIndex === 3 && 'highlight'}`
            }
          />
        ) : (
          <RiBrushLine
            className={
              `rm-item rm-draw center ${dirIndex === 3 && 'highlight'}`
            }
          />
        )}
      </div>
    </div>
  )
}

export default RadialMenu