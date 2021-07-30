import { useState } from 'react'
import { ExCon } from '../ex-comps'

import PrefsPalette from './PrefsPalette'
import AgePalette from './AgePalette.js'

import './palette.css'

const ExPalette = ({ 
  isCurrent, pindex, onBgSelect, onSelect, 
  onGradSelect, onImageSelect, onTrailsChanged, onPindexChanged 
}) => {
  const [shades, setShades] = useState({ isLoop: false, shades: ['#ffffff'] })
  
  const monoSelect = mono => onSelect({ isLoop: false, shades: [mono] })
  const ageSelect = shades => { setShades(shades); onSelect(shades) }

  const pconStyle = {
    transform: `translateX(${pindex * -324}px)`
  }

  return (
    <ExCon title='Palette' isCurrent={isCurrent}>
      <div className='ex-pcon' style={pconStyle}>
        <PrefsPalette 
          shades={shades}
          onBackgroundSelect={onBgSelect} 
          onMonoSelect={monoSelect}
          onGradientSelect={onGradSelect}
          onImageSelect={onImageSelect}
          onTrailsChanged={onTrailsChanged}
          onAgeConfigure={() => onPindexChanged(1)} 
        />

        <AgePalette 
          isCurrent={isCurrent} 
          onSelect={ageSelect} 
        />
      </div>
    </ExCon>
  )
}

export default ExPalette
