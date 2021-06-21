import { useContext } from 'react'
import { Context } from '../../context/Context'

import { ExCon } from './ex-comps'

const ExShapes = ({ isCurrent, onSelect }) => {
  const { shapes } = useContext(Context)

  return (
    <ExCon title='Patterns' isCurrent={isCurrent}>
      <div className='shape-con'>
        <div className='shape-item-pad' />

        {shapes.map(({ name, shape }, index) => 
        <div key={index} className='shape-item' onClick={() => onSelect(shape)}>{name}</div>)}

        <div className='shape-item-pad' />
      </div>
    </ExCon>
  )
}

export default ExShapes