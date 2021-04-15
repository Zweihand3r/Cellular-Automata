import { useState, useContext } from 'react'
import { Context } from '../../context/Context'

import { ExCon } from './ex-comps'

const ExShapes = ({ isCurrent }) => {
  const { shapes } = useContext(Context)

  return (
    <ExCon title='Shapes' isCurrent={isCurrent}>
      <div className='shape-item-pad' />

      {shapes.map(({ name }) => 
      <div className='shape-item'>{name}</div>)}

      <div className='shape-item-pad' />
    </ExCon>
  )
}

export default ExShapes