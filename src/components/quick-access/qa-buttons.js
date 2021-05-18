import { useRef } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import { IoSpeedometer } from 'react-icons/io5'
import { CgExtension } from 'react-icons/cg'
import { RiHeartPulseFill } from 'react-icons/ri'
import { RiBrushFill, RiBrushLine } from 'react-icons/ri'
import { IoIosColorPalette, IoMdCloseCircle } from 'react-icons/io'

const QaButton = ({ 
  children, unhide, animDelay, animDuration = 240, 
  onClick, onRightClick = () => {}, onHoverChanged 
}) => {
  const hoverRef = useRef(false)

  const rightClick = (e) => {
    e.preventDefault()
    onRightClick()
  }

  const mouseEnter = () => {
    hoverRef.current = true
    setTimeout(() => {
      if (hoverRef.current) {
        onHoverChanged(true)
      }
    }, 1000)
  }

  const mouseLeave = () => {
    hoverRef.current = false
    onHoverChanged(false)
  }

  const className = `qa-btn-con ${unhide ? 'qa-btn-in' : 'qa-btn-out'}`

  const style = {
    animationDuration: `${animDuration}ms`,
    animationDelay: unhide ? `${animDelay}ms` : '0ms'
  }

  return (
    <div 
      className={className} style={style}
      onClick={onClick} onContextMenu={rightClick}
      onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
    >{children}</div>
  )
}

const Play = ({ isPlaying, unhide, animDelay, onClick, onHoverChanged }) => {
  return (
    <QaButton 
      onClick={onClick} 
      unhide={unhide} 
      animDelay={animDelay} 
      onHoverChanged={onHoverChanged}
    >
      {isPlaying ?
      <FaPause className='center' /> :
      <FaPlay className='center' />}
    </QaButton>
  )
}

const Draw = ({ isDrawing, unhide, animDelay, onClick, onRightClick, onHoverChanged }) => {
  return (
    <QaButton 
      onClick={onClick} 
      onRightClick={onRightClick} 
      unhide={unhide} 
      animDelay={animDelay} 
      onHoverChanged={onHoverChanged}
    >
      {isDrawing ? <RiBrushFill className='center qa-draw' /> : <BrushIcon />}
    </QaButton>
  )
}

const Speed = ({ unhide, animDelay, onClick, onHoverChanged }) => {
  return (
    <QaButton 
      onClick={onClick} 
      unhide={unhide} 
      animDelay={animDelay} 
      onHoverChanged={onHoverChanged}
    >
      <SpeedIcon />
    </QaButton>
  )
}

const Shapes = ({ unhide, animDelay, onClick, onRightClick, onHoverChanged }) => {
  return (
    <QaButton 
      onClick={onClick} 
      onRightClick={onRightClick} 
      unhide={unhide} 
      animDelay={animDelay} 
      onHoverChanged={onHoverChanged}
    >
      <GridIcon />
    </QaButton>
  )
}

const Rules = ({ unhide, animDelay, onClick, onHoverChanged }) => {
  return (
    <QaButton 
      onClick={onClick} 
      unhide={unhide} 
      animDelay={animDelay} 
      onHoverChanged={onHoverChanged}
    >
      <RiHeartPulseFill className='center qa-rules' />
    </QaButton>
  )
}

const Colors = ({ unhide, animDelay, onClick, onHoverChanged }) => {
  return (
    <QaButton 
      onClick={onClick} 
      unhide={unhide} 
      animDelay={animDelay} 
      onHoverChanged={onHoverChanged}
    >
      <IoIosColorPalette className='center qa-colors' />
    </QaButton>
  )
}

const Close = ({ unhide, animDelay, animDuration, onClick, onHoverChanged }) => {
  return (
    <QaButton 
      onClick={onClick} 
      unhide={unhide} 
      animDelay={animDelay} 
      animDuration={animDuration}
      onHoverChanged={onHoverChanged}
    >
      <IoMdCloseCircle className='center qa-close' />
    </QaButton>
  )
}

const BrushIcon = () => <RiBrushLine className='center qa-draw' />
const GridIcon = () => <CgExtension className='center qa-shapes' />
const SpeedIcon = () => <IoSpeedometer className='center qa-speed' />

export { 
  Play, Draw, Speed, Shapes, Rules, Colors, Close,
  BrushIcon, GridIcon, SpeedIcon
}