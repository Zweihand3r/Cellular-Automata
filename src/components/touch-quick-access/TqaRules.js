import React, { useState, useEffect } from 'react'

const TqaRulesMain = ({ activeRule, outPhase, onSelect, onAnimOut }) => {
  const [bState, setBState] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [sState, setSState] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0])

  const toggleBBtn = (i) => {
    updateActiveRule(
      bState.map((st, idx) => i === idx ? 1 - st : st), 
      sState
    )
  }

  const toggleSBtn = (i) => {
    updateActiveRule(
      bState,
      sState.map((st, idx) => i === idx ? 1 - st : st)
    )
  }

  const animEnded = (i, e) => {
    if (
      i === 0 && 
      e.animationName === 'fade-out-anim'
    ) {
      onAnimOut()
    }
  }

  const updateActiveRule = (bState, sState) => {
    let b = '', s = ''
    bState.forEach((st, i) => {
      if (st) b += i
    })
    sState.forEach((st, i) => {
      if (st) s += i
    })
    onSelect(b, s)
  }

  useEffect(() => {
    const { b, s } = activeRule
    let i = 0
    const bState = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    const sState = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (i = 0; i < b.length; i++) {
      bState[parseInt(b.charAt(i))] = 1
    }
    for (i = 0; i < s.length; i++) {
      sState[parseInt(s.charAt(i))] = 1
    }
    setBState(bState)
    setSState(sState)
  }, [activeRule])

  return (
    <div>
      <div className='tqa-r-btns'>
        <div className={`tqa-rb tqa-rl ${outPhase && 'tqa-rb-out'}`}>B</div>
        {bState.map((s, i) => (
          <div 
            key={i} 
            className={`tqa-rb ${s && 'tqa-rb-checked'} ${outPhase && 'tqa-rb-out'}`}
            onClick={() => toggleBBtn(i)}
            onAnimationEnd={e => animEnded(i, e)}
          >
            {i}
          </div>
        ))}
      </div>
      <div className='tqa-r-btns tqa-rbs-s'>
        <div className={`tqa-rb tqa-rl ${outPhase && 'tqa-rb-out'}`}>S</div>
        {sState.map((s, i) => (
          <div 
            key={i} 
            className={`tqa-rb ${s && 'tqa-rb-checked'} ${outPhase && 'tqa-rb-out'}`}
            onClick={() => toggleSBtn(i)}
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  )
}

const TqaRules = props => {
  const [show, setShow] = useState(false)
  const [outPhase, setOutPhase] = useState(false)

  const { isCustomRules } = props

  const onAnimOut = () => {
    setShow(false)
    setOutPhase(false)
  }

  useEffect(() => {
    if (isCustomRules) {
      setShow(true)
    } else {
      if (show) {
        setOutPhase(true)
      }
    }
  }, [isCustomRules])

  if (!show) {
    return null
  }

  const _props = {
    ...props, outPhase, onAnimOut
  }

  return (
    <TqaRulesMain {..._props} />
  )
}

export default TqaRules