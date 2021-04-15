import { Play, Draw, Speed, Shapes, Rules, Colors, Close } from './qa-buttons'
import { ExIndicator } from './ex-comps'
import { useState } from 'react'

import ExRules from './ExRules'
import ExShapes from './ExShapes'
import ExPalette from './ExPalette'

import './quick-access.css'

const QuickAccess = ({ 
  animId, qaHidden, qaExpanded, isPlaying, isDrawing, 
  onQaHoverChanged, onQaExpanded, onPlayClicked, onDrawClicked 
}) => {
  const [qaIndex, setQaIndex] = useState(0)

  const qaExAction = (index) => {
    if (!qaExpanded) {
      onQaExpanded(true)
    }

    setQaIndex(index)
  }

  return (
    <div 
      className={`base base-${animId}`}
      onMouseEnter={() => onQaHoverChanged(true)}
      onMouseLeave={() => onQaHoverChanged(false)}
    >
      <div className={`ex-base ex-base-${animId}`}>
        <ExIndicator selectedIndex={qaIndex} />

        <ExShapes isCurrent={qaIndex === 2} />
        <ExRules isCurrent={qaIndex === 3} />
        <ExPalette isCurrent={qaIndex === 4} />
      </div>

      <div className='con'>
        <div className='qa-padding' />
        <Play isPlaying={isPlaying} unhide={!qaHidden} animDelay={280} onClick={onPlayClicked} />
        <Draw isDrawing={isDrawing} unhide={!qaHidden} animDelay={340} onClick={onDrawClicked} />
        <Shapes unhide={!qaHidden} animDelay={400} onClick={_ => qaExAction(2)} />
        <Rules unhide={!qaHidden} animDelay={460} onClick={_ => qaExAction(3)} />
        <Colors unhide={!qaHidden} animDelay={520} onClick={_ => qaExAction(4)} />
        <Speed unhide={!qaHidden} animDelay={580} />
        <Close unhide={!qaHidden} animDelay={640} onClick={_ => onQaExpanded(false)} />
        <div className='qa-padding' />
      </div>
    </div>
  )
}

export default QuickAccess
