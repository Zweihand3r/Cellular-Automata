import React, { useState, useEffect } from 'react'
import './touch-quick-access.css'

import { RiBrushFill, RiBrushLine, RiHeartPulseFill, RiHeartPulseLine } from 'react-icons/ri'
import { IoColorPalette, IoColorPaletteOutline, IoGrid, IoGridOutline } from 'react-icons/io5'
import { VscChevronUp, VscChevronRight, VscChevronDown, VscChevronLeft } from 'react-icons/vsc'

const TouchQuickAccess = ({ isMenu, modeIndex, dirIndex }) => {
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
      className={`tqa-root ${outPhase && 'scale-out'}`}
      onAnimationEnd={animEnded}
    >
      {/* BG ALSO CONTAINS ARROWS */}
      <div className='tqa-bg' >

        {/* ARROWS */}
        <div className='tqa-arrow-con arrow-up'>
          <VscChevronUp
            className={
              `tqa-arrow ${dirIndex === -1 && 'collapsed'} ${dirIndex === 0 && 'highlight'}`
            }
          />
        </div>

        <div className='tqa-arrow-con arrow-right'>
          <VscChevronRight
            className={
              `tqa-arrow ${dirIndex === -1 && 'collapsed'} ${dirIndex === 1 && 'highlight'}`
            }
          />
        </div>

        <div className='tqa-arrow-con arrow-down'>
          <VscChevronDown
            className={
              `tqa-arrow ${dirIndex === -1 && 'collapsed'} ${dirIndex === 2 && 'highlight'}`
            }
          />
        </div>

        <div className='tqa-arrow-con arrow-left'>
          <VscChevronLeft
            className={
              `tqa-arrow ${dirIndex === -1 && 'collapsed'} ${dirIndex === 3 && 'highlight'}`
            }
          />
        </div>
      </div>

      {/* ICONS */}
      <div className='tqa-item-con item-up'>
        {modeIndex === 0 ? (
          <IoColorPalette
            className={
              `tqa-item tqa-colors tqa-rules center ${dirIndex === 0 && 'highlight'}`
            }
          />
        ) : (
          <IoColorPaletteOutline
            className={
              `tqa-item tqa-colors tqa-rules center ${dirIndex === 0 && 'highlight'}`
            }
          />
        )}
      </div>

      <div className='tqa-item-con item-right'>
        {modeIndex === 1 ? (
          <RiHeartPulseFill
            className={
              `tqa-item tqa-rules center ${dirIndex === 1 && 'highlight'}`
            }
          />
        ) : (
          <RiHeartPulseLine
            className={
              `tqa-item tqa-rules center ${dirIndex === 1 && 'highlight'}`
            }
          />
        )}
      </div>

      <div className='tqa-item-con item-down'>
        {modeIndex === 2 ? (
          <IoGrid
            className={
              `tqa-item tqa-shapes center ${dirIndex === 2 && 'highlight'}`
            }
          />
        ) : (
          <IoGridOutline
            className={
              `tqa-item tqa-shapes center ${dirIndex === 2 && 'highlight'}`
            }
          />
        )}
      </div>

      <div className='tqa-item-con item-left'>
        {modeIndex === 3 ? (
          <RiBrushFill
            className={
              `tqa-item tqa-draw center ${dirIndex === 3 && 'highlight'}`
            }
          />
        ) : (
          <RiBrushLine
            className={
              `tqa-item tqa-draw center ${dirIndex === 3 && 'highlight'}`
            }
          />
        )}
      </div>
    </div>
  )
}

export default TouchQuickAccess