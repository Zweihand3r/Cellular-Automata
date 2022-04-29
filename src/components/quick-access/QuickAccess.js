import { BsChevronLeft } from 'react-icons/bs'

import { ExIndicator } from './ex-comps'
import { useState, useEffect, useContext } from 'react'
import { 
  Play, Draw, Speed, Shapes, Rules, Colors, Close,
  BrushIcon, GridIcon, SpeedIcon 
} from './qa-buttons'

import QaTooltip from './QaTooltip'
import QaSlider from './QaSlider'
import ExRules from './ExRules'
import ExShapes from './ExShapes'
import ExPalette from './palette/ExPalette'

import './quick-access.css'
import { NotificationContext } from '../../context/NotificationContext'

let sliderValue = 0

const QuickAccess = ({ 
  animId, qaHidden, qaExpanded, qaMinimised, 
  qaSlider, isPlaying, isDrawing, 

  onQaHoverChanged, onQaExpanded, onQaMinimised, onQaSlider, 
  onPlayClicked, onDrawClicked, onQaClose, onTempPause,

  onShapeSelect, onFillSelect, onClear, onRuleSelect, onWrapChanged, onBgSelect, onShadesSelect, 
  onGradSelect, onImageSelect, onTrailsChanged, onBrushChanged, onSizeChanged, onSpeedChanged, 
}) => {
  const { showNotification } = useContext(NotificationContext)

  const [qaIndex, setQaIndex] = useState(0)
  const [slideId, setSlideId] = useState('na')
  const [tipIndex, setTipIndex] = useState(0)
  const [tipVis, setTipVis] = useState(false)
  const [backVis, setBackVis] = useState(false)
  const [exPindices, setExPindices] = useState([0, 0, 0, 0, 0, 0])
  const [, setPhantomUpdateIndex] = useState(0)

  const qaExAction = (index, pindex = 0) => {
    if (!qaExpanded) {
      onQaExpanded(true)
    } else {
      if (qaIndex === index && exPindices[index] === pindex) {
        onQaExpanded(false)
        return
      }
    }

    setExPindices(exPindices.map((item, i) => i === index ? pindex : item))
    if (backVis) setBackVis(false)
    setQaIndex(index)
  }

  const exChangePage = (index, pindex, enableBack = false) => {
    setExPindices(exPindices.map((item, i) => i === index ? pindex : item))
    setBackVis(enableBack)
  }

  const closeAction = () => {
    if (qaExpanded) onQaExpanded(false)
    else onQaClose()
  }

  const minimise = () => onQaMinimised(true)

  const maximise = () => {
    if (qaMinimised) onQaMinimised(false)
  }

  const showSlider = (id) => {
    setSlideId(id)
    onQaSlider(true)
  }

  const dismissSlider = () => {
    onQaSlider(false)
    if (slideId === 'grid') {
      onSizeChanged(sliderValue)
    }
  }

  const sliderValueChanged = (value) => {
    sdat[slideId].value = value
    sliderValue = value
    
    switch (slideId) {
      case 'speed': onSpeedChanged(value); break
      case 'brush': onBrushChanged(value); break
      default: break
    }
  }

  const hoverChangedAtIndex = (hovered, index) => {
    setTipVis(hovered)
    if (hovered) setTipIndex(index)
  }

  const phantomUpdate = _ => {
    setPhantomUpdateIndex(ps => ps + 1)
  }

  useEffect(() => {
    const keyListener = e => {
      if (e.keyCode === 37 || e.keyCode === 39) {
        let speed = sdat['speed'].value
        const [speedLower, speedUpper] = sdat['speed'].range
        if (e.keyCode === 37 && speed > speedLower) {
          speed -= 1
        } else if (e.keyCode === 39 && speed < speedUpper) {
          speed += 1
        }
        sdat['speed'].value = speed
        onSpeedChanged(speed)
        showNotification(`Sim Speed ${speed}`)

        if (slideId === "speed") {
          phantomUpdate()
        }
      }
    }

    document.body.addEventListener("keydown", keyListener)

    return () => {
      document.body.removeEventListener("keydown", keyListener) 
    }
  }, [onSpeedChanged, slideId])

  const animdelays = animdelaysJson[animId]
  const unhide = !qaHidden && !qaSlider && !qaMinimised
  const closeAnimDuration = animId === 'sl2in' || animId === 'in2sl' || animId === 'ex2sl' ? 0 : 240

  return (
    <div className='qa-root'>
      <div 
        className={`base base-${animId}`}
        onClick={maximise}
        onMouseEnter={() => onQaHoverChanged(true)}
        onMouseLeave={() => onQaHoverChanged(false)}
      >
        <div className={`ex-base ex-base-${animId}`}>
          <ExIndicator selectedIndex={qaIndex} />

          <ExShapes 
            isCurrent={qaIndex === 2} 
            onShapeSelect={onShapeSelect} 
            onFillSelect={onFillSelect}
            onClear={onClear}
            onSliding={onTempPause} 
          />

          <ExRules 
            isCurrent={qaIndex === 3} 
            pindex={exPindices[3]}
            onSelect={onRuleSelect} 
            onWrapChanged={onWrapChanged}
            onPindexChanged={pi => exChangePage(3, 1, true)}
          />

          <ExPalette 
            isCurrent={qaIndex === 4} 
            pindex={exPindices[4]}
            qaExpanded={qaExpanded}
            onBgSelect={onBgSelect}
            onSelect={onShadesSelect} 
            onGradSelect={onGradSelect}
            onImageSelect={onImageSelect}
            onTrailsChanged={onTrailsChanged}
            onPindexChanged={pi => exChangePage(4, 1, true)}
          />

          <Back vis={backVis} onClick={() => exChangePage(qaIndex, 0)} />
        </div>

        <div className='con'>
          <QaSlider 
            unhide={qaSlider} 
            icon={sdat[slideId].icon} 
            value={sdat[slideId].value}
            range={sdat[slideId].range}
            onChange={sliderValueChanged}
            onDismiss={dismissSlider} 
          />

          <div className='qa-padding' />

          <Play 
            isPlaying={isPlaying} unhide={unhide} animDelay={animdelays[0]} 
            onClick={onPlayClicked} 
            onHoverChanged={h => hoverChangedAtIndex(h, 0)}
          />

          <Draw 
            isDrawing={isDrawing} unhide={unhide} animDelay={animdelays[1]} 
            onClick={onDrawClicked} onRightClick={_ => showSlider('brush')} 
            onHoverChanged={h => hoverChangedAtIndex(h, 1)}
          />
          
          <Shapes 
            unhide={unhide} animDelay={animdelays[2]} 
            onClick={_ => qaExAction(2)} onRightClick={_ => showSlider('grid')} 
            onHoverChanged={h => hoverChangedAtIndex(h, 2)}
          />

          <Rules 
            unhide={unhide} animDelay={animdelays[3]} 
            onClick={_ => qaExAction(3, 0)} onRightClick={_ => qaExAction(3, 1)} 
            onHoverChanged={h => hoverChangedAtIndex(h, 3)}
          />

          <Colors 
            unhide={unhide} animDelay={animdelays[4]} 
            onClick={_ => qaExAction(4)} onRightClick={_ => qaExAction(4, 1)}
            onHoverChanged={h => hoverChangedAtIndex(h, 4)}
          />

          <Speed 
            unhide={unhide} animDelay={animdelays[5]} 
            onClick={_ => showSlider('speed')} 
            onHoverChanged={h => hoverChangedAtIndex(h, 5)}
          />

          <Close 
            unhide={unhide} animDelay={animdelays[6]} animDuration={closeAnimDuration}
            onClick={closeAction} onRightClick={minimise}
            onHoverChanged={h => hoverChangedAtIndex(h, 6)}
          />

          <div className='qa-padding' />
        </div>
      </div>

      <QaTooltip vis={tipVis} index={tipIndex} />
    </div>
  )
}

const Back = ({ vis, onClick }) => {
  return (
    <div 
      className={`ex-back ${vis ? 'ex-back-vis' : ''}`}
      onClick={onClick}
    >
      <BsChevronLeft className='ex-back-ico center' />
      {/* <div className='ex-back-lbl center'>{'<'}</div> */}
    </div>
  )
}

const animdelaysJson = {
  'out2in': [280, 320, 360, 400, 440, 480, 520],
  'in2out': [0, 0, 0, 0, 0, 0, 0],
  'min2out': [0, 0, 0, 0, 0, 0, 0],
  'out2min': [0, 0, 0, 0, 0, 0, 0],
  'in2min': [0, 0, 0, 0, 0, 0, 0],
  'min2in': [280, 320, 360, 400, 440, 480, 520],
  'in2ex': [0, 0, 0, 0, 0, 0, 0],
  'ex2in': [0, 0, 0, 0, 0, 0, 0],
  'ex2sl': [0, 0, 0, 0, 0, 0, 0],
  'ex2min': [0, 0, 0, 0, 0, 0, 0],
  'min2ex': [280, 320, 360, 400, 440, 480, 520],
  'sl2in': [240, 200, 160, 120, 80, 40, 240],
  'in2sl': [0, 0, 0, 0, 0, 0, 0]
}

const sdat = {
  na: { value: -1, range: [0, 1], icon: <div /> },
  brush: { value: 25, range: [1, 100], icon: <BrushIcon /> },
  grid: { value: 5, range: [1, 50], icon: <GridIcon /> },
  speed: { value: 97, range: [1, 100], icon: <SpeedIcon /> }
}

export default QuickAccess
