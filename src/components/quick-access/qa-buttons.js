import { FaPlay, FaPause } from 'react-icons/fa'
import { IoSpeedometer } from 'react-icons/io5'
import { CgExtension } from 'react-icons/cg'
import { RiHeartPulseFill } from 'react-icons/ri'
import { RiBrushFill, RiBrushLine } from 'react-icons/ri'
import { IoIosColorPalette, IoMdCloseCircle } from 'react-icons/io'

const QaButton = ({ children, unhide, animDelay, onClick }) => {
  return (
    <div 
      className={`qa-btn-con ${unhide ? 'qa-btn-in' : 'qa-btn-out'}`} 
      style={{ animationDelay: unhide ? `${animDelay}ms` : '0ms' }}
      onClick={onClick}>
      {children}
    </div>
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

const Draw = ({ isDrawing, unhide, animDelay, onClick }) => {
  return (
    <QaButton onClick={onClick} unhide={unhide} animDelay={animDelay}>
      {isDrawing ?
      <RiBrushFill className='center qa-draw' /> :
      <RiBrushLine className='center qa-draw' />}
    </QaButton>
  )
}

const Speed = ({ unhide, animDelay, onClick }) => {
  return (
    <QaButton onClick={onClick} unhide={unhide} animDelay={animDelay}>
      <IoSpeedometer className='center qa-speed' />
    </QaButton>
  )
}

const Shapes = ({ unhide, animDelay, onClick }) => {
  return (
    <QaButton onClick={onClick} unhide={unhide} animDelay={animDelay}>
      <CgExtension className='center qa-shapes' />
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

export { Play, Draw, Speed, Shapes, Rules, Colors, Close }