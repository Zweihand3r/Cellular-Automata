import { useContext } from 'react'
import { Context } from '../../context/Context'

import { ExCon } from './ex-comps'

const ExShapes = ({ isCurrent, onSelect }) => {
  const { shapes } = useContext(Context)

  return (
    <ExCon title='Shapes' isCurrent={isCurrent}>
      <div className='shape-item-pad' />

      {shapes.map(({ name, shape }, index) => 
      <div key={index} className='shape-item' onClick={() => onSelect(shape)}>{name}</div>)}

      <div className='shape-item-pad' />
    </ExCon>
  )
}

export default ExShapes