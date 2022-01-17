import { useState, useEffect, useCallback } from 'react'
import { IoMdCloseCircle } from 'react-icons/io'

let liveValue = 0

const QaSlider = ({ unhide, icon, value, range, onChange, onDismiss }) => {
  const offsetX = window.innerWidth / 2 - 162
  
  const [trackX, setTrackX] = useState(150)
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const [lower, upper] = range
    updateTrackX(Math.lerp(20, 300, Math.inverseLerp(lower, upper, value)))
  }, [value])

  const updateTrackX = (trackX) => {
    setTrackX(trackX)
    const [lower, upper] = range
    const rounded = Math.round(Math.lerp(lower, upper, Math.inverseLerp(20, 300, trackX)))
    
    if (rounded !== liveValue) {
      liveValue = rounded
      onChange(rounded)
    }
  }

  const mouseMove = (e) => {
    if (isPressed && e.button === 0) {
      updateTrackX(Math.clamp(e.clientX - offsetX, 20, 300))
    }
  }

  const mouseClick = (e) => {
    updateTrackX(Math.clamp(e.clientX - offsetX, 20, 300))
  }

  const rightClick = (e) => {
    e.preventDefault()
    onDismiss()
  }

  const mouseDown = useCallback((e) => {
    if (e.button === 0) {
      setIsPressed(true)
      document.addEventListener('mouseup', mouseUp, { once: true })
    }
  }, [])

  const mouseUp = () => {
    setIsPressed(false)
  }

  const trackStyle = { width: trackX }
  const thumbStyle = { left: trackX - 20 }
  const labelStyle = { left: trackX + offsetX - 18 }
  const conClass = `qa-sl-con ${unhide ? 'qa-sl-in' : ''}`
  const thumbClass = `qa-sl-thumb ${isHovered ? 'qa-sl-thumb-hov' : ''}`
  const labelClass = `qa-sl-lbl ${isPressed ? 'qa-sl-lbl-pressed' : ''}`
  const closeClass = `qa-sl-x ${unhide ? 'qa-sl-x-in' : 'qa-sl-x-out'}`

  return (
    <div className={conClass}>
      <div className='qa-sl-track-con'>
        <div className='qa-sl-track' style={trackStyle} />
      </div>

      <div className={thumbClass} style={thumbStyle}>
        {icon}
      </div>

      <div 
        className='qa-sl-receiver' 
        onMouseMove={mouseMove} 
        onMouseDown={mouseDown}
        onMouseEnter={_ => setIsHovered(true)}
        onMouseLeave={_ => setIsHovered(false)}
        onContextMenu={rightClick}
        onClick={mouseClick}
      >
        <div className={labelClass} style={labelStyle}>{liveValue}</div>
      </div>

      <div className={closeClass} onClick={onDismiss}>
        <IoMdCloseCircle className='qa-sl-x-ico' />
      </div>
    </div>
  )
}

export default QaSlider
