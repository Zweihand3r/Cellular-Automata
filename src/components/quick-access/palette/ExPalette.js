import { useState, useRef, useEffect } from 'react'
import { ExCon, ExHexButton } from '../ex-comps'

import PrefsPalette from './PrefsPalette'
import AgePalette from './AgePalette.js'
import COLOR_GRID from '../../../static/color-grid'

import './palette.css'

const ExPalette = ({ 
  isCurrent, pindex, qaExpanded, onBgSelect, onSelect, 
  onGradSelect, onImageSelect, onTrailsChanged, onPindexChanged 
}) => {
  const [shades, setShades] = useState({ isLoop: false, shades: ['#ffffff'] })
  const [cgVisible, setCgVisible] = useState(false)
  const [cgCurrentHex, setCgCurrentHex] = useState('#fff')

  const onColorSelectedRef = useRef(null)
  
  const monoSelect = mono => onSelect({ isLoop: false, shades: [mono] })
  const ageSelect = shades => { setShades(shades); onSelect(shades) }

  const selectColor = (onSelect, current = '#000') => {
    setCgVisible(true)
    setCgCurrentHex(current)
    onColorSelectedRef.current = onSelect
  }

  const onColorSelected = hex => {
    setCgVisible(false)
    onColorSelectedRef.current(hex)
  }

  const onCustomSelected = hex => {
    onColorSelectedRef.current(hex)
  }

  const pconStyle = {
    transform: `translateX(${pindex * -324}px)`
  }

  useEffect(() => {
    if (!isCurrent || !qaExpanded) {
      setCgVisible(false)
    }
  }, [isCurrent, qaExpanded])

  return (
    <ExCon title='Palette' isCurrent={isCurrent}>
      <div className='ex-pcon' style={pconStyle}>
        <PrefsPalette 
          shades={shades}
          selectColor={selectColor}
          onBackgroundSelect={onBgSelect} 
          onMonoSelect={monoSelect}
          onGradientSelect={onGradSelect}
          onImageSelect={onImageSelect}
          onTrailsChanged={onTrailsChanged}
          onAgeConfigure={() => onPindexChanged(1)} 
        />

        <AgePalette 
          isCurrent={isCurrent} 
          selectColor={selectColor}
          onSelect={ageSelect} 
        />
      </div>

      <ColorGrid 
        cgVisible={cgVisible} 
        currentHex={cgCurrentHex}
        onSelect={onColorSelected}
        onCustom={onCustomSelected}
        onCancel={() => setCgVisible(false)} 
      />
    </ExCon>
  )
}

const ColorGrid = ({ cgVisible, currentHex, onSelect, onCustom, onCancel }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isCustomChanged, setIsCustomChanged] = useState(false)
  const inputRef = useRef(null)

  const animEnded = (e, i) => {
    if (i === COLOR_GRID.length - 1 && e.animationName === 'cgc-out-anim') {
      setIsVisible(false)
    }
  }

  const customChange = e => {
    if (!isCustomChanged) {
      setIsCustomChanged(true)
    }
    onCustom(e.target.value)
  }

  useEffect(() => {
    if (cgVisible) {
      setIsVisible(true)
      setIsCustomChanged(false)
    }
  }, [cgVisible])

  return (
    <>
      {isVisible && (
        <div className='color-grid'>
          <div className={`cg-bg ${!cgVisible && 'cg-bg-out'}`}>
            <div className='cg-footer'>
              <ExHexButton name={isCustomChanged ? 'Apply' : 'Cancel'} x={13} y={4} onClick={onCancel} />
              <ExHexButton name='Custom' x={171} y={4} onClick={() => inputRef.current.click()} />
              <input 
                className='cg-dummy-input' 
                type='color' 
                value={currentHex}
                ref={inputRef}
                onChange={customChange} 
              />
            </div>
          </div>
          <div className='cg-container'>
            {COLOR_GRID.map((hex, i) => (
              <div 
                key={hex}
                className={`cg-cell ${!cgVisible && 'cg-cell-out'}`} 
                style={{ background: hex }} 
                onAnimationEnd={e => animEnded(e, i)}
                onClick={() => onSelect(hex)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ExPalette
