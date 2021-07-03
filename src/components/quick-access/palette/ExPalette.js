import { ExCon } from '../ex-comps'

import AgePalette from './AgePalette.js'

import './palette.css'

const ExPalette = ({ isCurrent, onSelect }) => {
  return (
    <ExCon title='Palette' isCurrent={isCurrent}>
      <div className='palette-con'>
        <AgePalette isCurrent={isCurrent} onSelect={onSelect} />
      </div>
    </ExCon>
  )
}

export default ExPalette
