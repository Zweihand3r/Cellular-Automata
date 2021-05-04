import { ExIndicator } from './ex-comps'
import { useState } from 'react'
import { 
  Play, Draw, Speed, Shapes, Rules, Colors, Close,
  BrushIcon, GridIcon, SpeedIcon 
} from './qa-buttons'

import QaSlider from './QaSlider'
import ExRules from './ExRules'
import ExShapes from './ExShapes'
import ExPalette from './ExPalette'

import './quick-access.css'

let sliderValue = 0

const QuickAccess = ({ 
  animId, qaHidden, qaExpanded, qaSlider, isPlaying, isDrawing, 
  onQaHoverChanged, onQaExpanded, onQaSlider, onPlayClicked, onDrawClicked,
  onShapeSelect, onRuleSelect, onShadesSelect,
  onBrushChanged, onSizeChanged, onSpeedChanged
}) => {
  const [qaIndex, setQaIndex] = useState(0)
  const [slideId, setSlideId] = useState('na')

  const qaExAction = (index) => {
    if (!qaExpanded) {
      onQaExpanded(true)
    }

    setQaIndex(index)
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
    }
  }

  const unhide = !qaHidden && !qaSlider
  const animdelays = animdelaysJson[animId]

  return (
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
        <div className='qa-padding' />

        <QaSlider 
          unhide={qaSlider} 
          icon={sdat[slideId].icon} 
          value={sdat[slideId].value}
          range={sdat[slideId].range}
          onChange={sliderValueChanged}
          onDismiss={dismissSlider} 
        />

        <Play 
          isPlaying={isPlaying} unhide={unhide} animDelay={animdelays[0]} 
          onClick={onPlayClicked} 
        />

        <Draw 
          isDrawing={isDrawing} unhide={unhide} animDelay={animdelays[1]} 
          onClick={onDrawClicked} // onRightClick={_ => showSlider('brush')} 
        />
        
        <Shapes 
          unhide={unhide} animDelay={animdelays[2]} 
          onClick={_ => qaExAction(2)} onRightClick={_ => showSlider('grid')} 
        />

        <Rules 
          unhide={unhide} animDelay={animdelays[3]} 
          onClick={_ => qaExAction(3)} 
        />

        <Colors 
          unhide={unhide} animDelay={animdelays[4]} 
          onClick={_ => qaExAction(4)} 
        />

        <Speed 
          unhide={unhide} animDelay={animdelays[5]} 
          onClick={_ => showSlider('speed')} 
        />

        <Close 
          unhide={unhide} animDelay={animdelays[6]} 
          onClick={_ => onQaExpanded(false)} 
        />

        <div className='qa-padding' />
      </div>
    </div>
  )
}

const animdelaysJson = {
  'out2in': [280, 340, 400, 460, 520, 580, 640],
  'in2out': [0, 0, 0, 0, 0, 0, 0],
  'in2ex': [0, 0, 0, 0, 0, 0, 0],
  'ex2in': [0, 0, 0, 0, 0, 0, 0],
  'ex2sl': [0, 0, 0, 0, 0, 0, 0],
  'sl2in': [240, 200, 160, 120, 80, 40, 0],
  'in2sl': [0, 0, 0, 0, 0, 0, 0]
}

const sdat = {
  na: { value: -1, range: [0, 1], icon: <div /> },
  brush: { value: 1, range: [1, 10], icon: <BrushIcon /> },
  grid: { value: 5, range: [1, 50], icon: <GridIcon /> },
  speed: { value: 97, range: [1, 100], icon: <SpeedIcon /> }
}

export default QuickAccess
