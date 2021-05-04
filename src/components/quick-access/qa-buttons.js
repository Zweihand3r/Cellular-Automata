import { FaPlay, FaPause } from 'react-icons/fa'
import { IoSpeedometer } from 'react-icons/io5'
import { CgExtension } from 'react-icons/cg'
import { RiHeartPulseFill } from 'react-icons/ri'
import { RiBrushFill, RiBrushLine } from 'react-icons/ri'
import { IoIosColorPalette, IoMdCloseCircle } from 'react-icons/io'

const QaButton = ({ children, unhide, animDelay, onClick, onRightClick }) => {
  const rightClick = (e) => {
    e.preventDefault()
    onRightClick ? onRightClick() : () => {}
  }

  return (
    <div 
      className={`qa-btn-con ${unhide ? 'qa-btn-in' : 'qa-btn-out'}`} 
      style={{ animationDelay: unhide ? `${animDelay}ms` : '0ms' }}
      onClick={onClick} onContextMenu={rightClick}
    >{children}</div>
  )
}

const Play = ({ isPlaying, unhide, animDelay, onClick }) => {
  return (
    <QaButton onClick={onClick} unhide={unhide} animDelay={animDelay}>
      {isPlaying ?
      <FaPause className='center' /> :
      <FaPlay className='center' />}
    </QaButton>
  )
}

const Draw = ({ isDrawing, unhide, animDelay, onClick, onRightClick }) => {
  return (
    <QaButton onClick={onClick} onRightClick={onRightClick} unhide={unhide} animDelay={animDelay}>
      {isDrawing ? <RiBrushFill className='center qa-draw' /> : <BrushIcon />}
    </QaButton>
  )
}

const Speed = ({ unhide, animDelay, onClick }) => {
  return (
    <QaButton onClick={onClick} unhide={unhide} animDelay={animDelay}>
      <SpeedIcon />
    </QaButton>
  )
}

const Shapes = ({ unhide, animDelay, onClick, onRightClick }) => {
  return (
    <QaButton onClick={onClick} onRightClick={onRightClick} unhide={unhide} animDelay={animDelay}>
      <GridIcon />
    </QaButton>
  )
}

const Rules = ({ unhide, animDelay, onClick }) => {
  return (
    <QaButton onClick={onClick} unhide={unhide} animDelay={animDelay}>
      <RiHeartPulseFill className='center qa-rules' />
    </QaButton>
  )
}

const Colors = ({ unhide, animDelay, onClick }) => {
  return (
    <QaButton onClick={onClick} unhide={unhide} animDelay={animDelay}>
      <IoIosColorPalette className='center qa-colors' />
    </QaButton>
  )
}

const Close = ({ unhide, animDelay, onClick }) => {
  return (
    <QaButton onClick={onClick} unhide={unhide} animDelay={animDelay}>
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