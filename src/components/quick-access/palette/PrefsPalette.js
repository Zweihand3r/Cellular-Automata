import { useState, useEffect, useRef, useCallback } from 'react'
import { BsChevronRight, BsCloudUpload } from 'react-icons/bs'

import { ExSubTitle } from '../ex-comps'

const offsetX = window.innerWidth / 2 - 152

const PrefsPalette = ({ 
  shades, onBackgroundSelect, onMonoSelect, onGradientSelect, 
  onImageSelect, onAgeConfigure, onTrailsChanged, selectColor
}) => {
  /* trails state in Modes */
  const [modeEx, setModeEx] = useState(false)
  const [modeIndex, setModeIndex] = useState(0)
  const [modeStates, setModeStates] = useState([
    '#ffffff', ['#ff2600', '#0096ff'], '', shades
  ])

  const select = i => {
    if (i !== modeIndex) {
      const events = [onMonoSelect, onGradientSelect, onImageSelect, onAgeConfigure]
      events[i](modeStates[i])
      setModeIndex(i)
    }

    setModeEx(false)
  }

  const monoSelect = mono => {
    setModeStates(modeStates.map((st, i) => i === 0 ? mono : st))
    onMonoSelect(mono)
  }

  const gradientSelect = grad => {
    setModeStates(modeStates.map((st, i) => i === 1 ? grad : st))
    onGradientSelect(grad)
  }

  const imageSelect = src => {
    setModeStates(modeStates.map((st, i) => i === 2 ? src : st))
    onImageSelect(src)
  }

  useEffect(() => {
    const nextStates = [...modeStates]
    if (shades.shades.length === 1) {
      setModeIndex(0)
      nextStates[0] = shades.shades[0]
    } else {
      setModeIndex(3)
    }
    nextStates[3] = shades
    setModeStates(nextStates)
  }, [shades])

  return (
    <div className='ex-pg'>
      <ExSubTitle fontSize={13} width={78} subtitle='BACKGROUND COLOR' />
      <ColorSelection color='#000000' selectColor={selectColor} onChange={onBackgroundSelect} />

      <div style={{height: 12}} />

      <ExSubTitle fontSize={13} width={103} subtitle='COLOR MODE' />
      <ModeDropdown 
        ex={modeEx} onExpand={ex => setModeEx(ex)}
        currentIndex={modeIndex} onSelect={select} 
      />

      <Modes 
        vis={!modeEx} 
        currentIndex={modeIndex} 
        states={modeStates}
        selectColor={selectColor}
        onMonoChanged={monoSelect}
        onGradientChanged={gradientSelect}
        onImageSelect={imageSelect}
        onAgeConfigure={onAgeConfigure}
        onTrailsChanged={onTrailsChanged}
      />
    </div>
  )
} 

const Modes = ({ 
  vis, currentIndex, states, selectColor,
  onMonoChanged, onGradientChanged, onImageSelect, onAgeConfigure, onTrailsChanged
}) => {
  const [mono, gradient, src, shades] = states

  const [trails, setTrails] = useState(0)
  const uploadRef = useRef(null)
  const canvasRef = useRef(null)

  const modesClass = `mds-con ${vis ? '' : 'mds-inv'}`

  const updateGradientStops = (v, index) => {
    onGradientChanged(gradient.map((s, i) => i === index ? v : s))
  }

  const trailsChanged = trails => {
    setTrails(trails)
    onTrailsChanged(trails)
  }

  const uploadImage = () => uploadRef.current.click()

  const onSrcChange = e => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(URL.createObjectURL(e.target.files[0]))
    }
  }

  const renderContent = () => {
    switch (currentIndex) {
      // Mono
      case 0: return (
        <div>
          <ExSubTitle fontSize={13} width={102} subtitle='MONO COLOR' />
          <ColorSelection color={mono} selectColor={selectColor} onChange={onMonoChanged} />
          <Trails value={trails} onChange={trailsChanged} />
        </div>
      )

      // Gradient
      case 1: return (
        <div>
          <ExSubTitle fontSize={13} width={91} subtitle='GRADIENT STOPS' />
          <ColorSelection color={gradient[0]} selectColor={selectColor} onChange={v => updateGradientStops(v, 0)} />
          <div style={{ height: 4 }} />
          <ColorSelection color={gradient[1]} selectColor={selectColor} onChange={v => updateGradientStops(v, 1)} />
        </div>
      )

      // Image
      case 2: return (
        <div>
          {src ? <img className='upl-preview' src={src} alt="" /> : <div />}
          <div className='pp-con ppb-con' onClick={uploadImage}>
            <div className='ppb-lbl'>Upload Image</div>
            <div className='ppb-ri-con' style={{right: 4}}>
              <BsCloudUpload className='ppb-ri center' />
            </div>
            <input type='file' ref={uploadRef} onChange={onSrcChange} />
          </div>
        </div>
      )

      // AgeBased
      case 3: return (
        <div>
          <ExSubTitle fontSize={11} width={22}>Cells change color from left to right as they age</ExSubTitle>
          <div className='pp-con'>
            <canvas className='age-preview' ref={canvasRef} />
          </div>
          <div style={{ height: 12 }} />
          <div className='pp-con ppb-con' onClick={onAgeConfigure}>
            <div className='ppb-lbl'>Configure Age Based</div>
            <div className='ppb-ri-con'>
              <BsChevronRight className='ppb-ri center' />
            </div>
          </div>
          <Trails value={trails} onChange={trailsChanged} />
        </div>
      )

      default: return <div />
    }
  }

  useEffect(() => {
    if (currentIndex === 3) {
      const canvas = canvasRef.current
      canvas.setAttribute('width', 304)
      canvas.setAttribute('height', 26)

      const ctx = canvas.getContext('2d')
      const width = 304 / shades.shades.length

      ctx.clearRect(0, 0, 304, 26)
      for (let i = 0; i < shades.shades.length; i++) {
        ctx.fillStyle = shades.shades[i]
        ctx.fillRect(i * width, 0, width, 26)
      }
    }
  }, [currentIndex, shades])

  return (
    <div className={modesClass}>
      <div style={{ height: 12 }} />
      {renderContent()}
    </div>
  )
}

const ColorSelection = ({ color, selectColor, onChange }) => {
  const [hex, setHex] = useState('#000000')
  const [hasFocus, setHasFocus] = useState(false)

  const showColorGrid = () => {
    selectColor(_hex => {
      setHex(_hex)
      onChange(_hex)
    }, hex)
  }

  const updateHex = e => {
    const text = e.target.value
    if (text.indexOf('#') < 0) {
      setHex(`#${text}`)
    } else if (text.length > hex.length && text.length < 8) {
      if (/^[0-9A-Fa-f]+$/.test(text.substring(1))) setHex(text)
      if (text.length === 7) onChange(text)
    } else if (text.length < hex.length && text.length > 0) {
      setHex(text)
    }
  }

  const editingComplete = () => {
    let _hex = hex
    const padding = 7 - _hex.length
    for (let i = 0; i < padding; i++) {
      _hex += "0"
    }
    setHex(_hex)
    setHasFocus(false)
    onChange(_hex)
  }

  useEffect(() => setHex(color), [color])

  return (
    <div className='pp-con' style={{borderColor: hasFocus ? '#ffffff' : '#a2a2a2'}}>
      <div className='cs-cp' style={{backgroundColor: hex}} onClick={showColorGrid} />
      <input 
        type='text' className='cs-tf tint-tf' value={hex.toUpperCase()} 
        onChange={updateHex} onFocus={() => setHasFocus(true)} onBlur={editingComplete}
      />
    </div>
  )
}

const ModeDropdown = ({ ex, currentIndex, onExpand, onSelect }) => {
  const baseClick = () => {
    if (!ex) onExpand(true)
  }

  const baseClass = `pp-con md-con ${ex ? 'md-ex' : ''}`
  const lblClass = `md-lbl ${ex ? 'md-lbl-ex' : ''}`

  return (
    <div className={baseClass} onClick={baseClick}>
      <div className={lblClass}>{modes[currentIndex]}</div>
        
      <div className='mex-con'>
        {modes.map((mode, i) => (
          <div className='mex-item' key={i}
            onClick={() => onSelect(i)}>{mode}
          </div>
        ))}
      </div>
    </div>
  )
}

const Trails = ({ value, onChange }) => {
  const [trackX, setTrackX] = useState(13)
  const [isPressed, setIsPressed] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const updateTrackX = trackX => {
    setTrackX(trackX)
    const rounded = Math.round(Math.lerp(0, 255, Math.inverseLerp(13, 289, trackX)))
    setShowInfo(rounded > 200)
    onChange(rounded)
  }

  const mouseMove = e => {
    if (isPressed && e.button === 0) {
      /* min/max should have been 14 and 300 but is -1 each instead (because topMargin: -1) */
      updateTrackX(Math.clamp(e.clientX - offsetX, 13, 289))
    }
  }

  const mouseDown = useCallback((e) => {
    if (e.button === 0) {
      setIsPressed(true)
      document.addEventListener('mouseup', mouseUp, { once: true })
    }
  }, [])

  const mouseClick = e => {
    updateTrackX(Math.clamp(e.clientX - offsetX, 13, 289))
  }

  useEffect(() => {
    updateTrackX(Math.lerp(13, 289, Math.inverseLerp(0, 255, value)))
  }, [])

  const mouseUp = () => setIsPressed(false)

  const trackStyle = { width: Math.max(trackX - 14, 0) }
  const thumbStyle = { transform: `translateX(${trackX - 14}px)` }

  return (
    <div>
      <div style={{height: 12}} />
      <ExSubTitle fontSize={13} width={124} subtitle='TRAILS' />

      <div 
        className='pp-con pps-con' 
        onMouseMove={mouseMove}
        onMouseDown={mouseDown}
        onClick={mouseClick}
      >
        <div className='pps-trk' style={trackStyle} />
          <div className='pps-th' style={thumbStyle}>
        </div>
      </div>

      <div className='clr-info' style={{opacity: showInfo ? 1 : 0}}><i>Higher values will 
        cause the canvas to not clear when applying patterns or changing rules and palette. 
        Use </i><b>Clear</b><i> button in </i><b>PATTERNS</b><i> to force clear the grid.</i></div> : <div />
    </div>
  )
}

const modes = ["Mono", "Gradient", "Image", "Age Based"]

export default PrefsPalette
