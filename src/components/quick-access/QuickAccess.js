import { ExIndicator } from './ex-comps'
import { useState } from 'react'
import { 
  Play, Draw, Speed, Shapes, Rules, Colors, Close,
  BrushIcon, GridIcon, SpeedIcon 
} from './qa-buttons'

import QaTooltip from './QaTooltip'
import QaSlider from './QaSlider'
import ExRules from './ExRules'
import ExShapes from './ExShapes'
import ExPalette from './ExPalette'

import './quick-access.css'

let sliderValue = 0

const QuickAccess = ({ 
  animId, qaHidden, qaExpanded, qaSlider, isPlaying, isDrawing, 
  onQaHoverChanged, onQaExpanded, onQaSlider, onPlayClicked, onDrawClicked, onQaClose,
  onShapeSelect, onRuleSelect, onShadesSelect, onBrushChanged, onSizeChanged, onSpeedChanged
}) => {
  const [qaIndex, setQaIndex] = useState(0)
  const [slideId, setSlideId] = useState('na')
  const [tipIndex, setTipIndex] = useState(0)
  const [tipVis, setTipVis] = useState(false)

  const qaExAction = (index) => {
    if (qaExpanded && qaIndex === index) {
      onQaExpanded(false)
    } else {
      onQaExpanded(true)
    }

    setQaIndex(index)
  }

  const closeAction = () => {
    if (qaExpanded) onQaExpanded(false)
    else onQaClose()
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
    }
  }

  const hoverChangedAtIndex = (hovered, index) => {
    setTipVis(hovered)
    if (hovered) setTipIndex(index)
  }

  const unhide = !qaHidden && !qaSlider
  const animdelays = animdelaysJson[animId]
  const closeAnimDuration = animId === 'sl2in' || animId === 'in2sl' ? 0 : 240

  return (
    <div className='root'>
      <div 
        className={`base base-${animId}`}
        onMouseEnter={() => onQaHoverChanged(true)}
        onMouseLeave={() => onQaHoverChanged(false)}
      >
        <div className={`ex-base ex-base-${animId}`}>
          <ExIndicator selectedIndex={qaIndex} />

          <ExShapes isCurrent={qaIndex === 2} onSelect={onShapeSelect} />
          <ExRules isCurrent={qaIndex === 3} onSelect={onRuleSelect} />
          <ExPalette isCurrent={qaIndex === 4} onSelect={onShadesSelect} />
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
            onClick={_ => qaExAction(3)} 
            onHoverChanged={h => hoverChangedAtIndex(h, 3)}
          />

          <Colors 
            unhide={unhide} animDelay={animdelays[4]} 
            onClick={_ => qaExAction(4)} 
            onHoverChanged={h => hoverChangedAtIndex(h, 4)}
          />

          <Speed 
            unhide={unhide} animDelay={animdelays[5]} 
            onClick={_ => showSlider('speed')} 
            onHoverChanged={h => hoverChangedAtIndex(h, 5)}
          />

          <Close 
            unhide={unhide} animDelay={animdelays[6]} animDuration={closeAnimDuration}
            onClick={closeAction} 
            onHoverChanged={h => hoverChangedAtIndex(h, 6)}
          />

          <div className='qa-padding' />
        </div>
      </div>

      <QaTooltip vis={tipVis} index={tipIndex} />
    </div>
  )
}

const animdelaysJson = {
  'out2in': [280, 320, 360, 400, 440, 480, 520],
  'in2out': [0, 0, 0, 0, 0, 0, 0],
  'in2ex': [0, 0, 0, 0, 0, 0, 0],
  'ex2in': [0, 0, 0, 0, 0, 0, 0],
  'ex2sl': [0, 0, 0, 0, 0, 0, 0],
  'sl2in': [240, 200, 160, 120, 80, 40, 240],
  'in2sl': [0, 0, 0, 0, 0, 0, 0]
}

const sdat = {
  na: { value: -1, range: [0, 1], icon: <div /> },
  brush: { value: 1, range: [1, 50], icon: <BrushIcon /> },
  grid: { value: 5, range: [1, 50], icon: <GridIcon /> },
  speed: { value: 97, range: [1, 100], icon: <SpeedIcon /> }
}

export default QuickAccess
