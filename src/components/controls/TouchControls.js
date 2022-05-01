import React from 'react'
import TouchReceiver from '../receivers/TouchReceiver'

import './controls.css'

const TouchControls = ({ onRuleSelect }) => {
  return (
    <div className='controls-base'>
      <TouchReceiver 
        onDynamicRule={onRuleSelect}
      />
    </div>
  )
}

export default TouchControls