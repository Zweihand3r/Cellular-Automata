import { useState, useEffect, useContext } from 'react'
import { FiChevronRight } from 'react-icons/fi'

import { Context } from '../../context/Context'
import { ExCon, ExSubTitle, ExCheckbox } from './ex-comps'

const ExRules = ({ isCurrent, pindex, onSelect, onWrapChanged, onPindexChanged }) => {
  const { rules } = useContext(Context)

  const [arIndex, setArIndex] = useState(0)
  const [activeRule, setActiveRule] = useState(rules[arIndex]) // Conway's Life

  const pconStyle = {
    transform: `translateX(${pindex * -324}px)`
  }

  const updateActiveRule = ({ b, s, ari }) => {
    let selectedRule = {...activeRule}
    if (ari > -1) {
      if (ari !== arIndex) {
        setArIndex(ari)
        selectedRule = rules[ari]
      }
    } else {
      let isCustom = true
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].b === b && rules[i].s === s) {
          if (arIndex !== i) {
            isCustom = false
            setArIndex(i)
            selectedRule = rules[i]
          }
          break
        }
      }
      if (isCustom) {
        selectedRule = { name: 'Custom', b, s }
        setArIndex(-1)
      }
    }
    setActiveRule(selectedRule)
    onSelect(selectedRule)
  }

  return (
    <ExCon title='Rules' isCurrent={isCurrent}>
      <div className='ex-pcon' style={pconStyle}>
        <Presets 
          rules={rules} 
          currentIndex={arIndex} 
          onSelect={updateActiveRule} 
        />

        <Custom 
          activeRule={activeRule}
          onChanged={updateActiveRule} 
          onWrapChanged={onWrapChanged}
          onSelectPresets={() => onPindexChanged(1)} 
        />
      </div>
    </ExCon>
  )
}

const Presets = ({ rules, currentIndex, onSelect }) => {
  return (
    <div className='ex-pg ex-pg2'>
      <div className='ex-flick'>
        {rules.map(({name, b, s}, index) => 
        <RuleCell 
          key={index}  
          name={name} b={b} s={s} 
          selected={currentIndex === index}
          onClick={() => onSelect({ ari: index })} 
        />)}
      </div>
    </div>
  )
}

const Custom = ({ activeRule, onSelectPresets, onWrapChanged, onChanged }) => {
  const { name, b, s } = activeRule

  const updateRule = ({ nb, ns }) => {
    onChanged({
      ari: -1,
      b: nb !== undefined ? nb : b,
      s: ns !== undefined ? ns : s
    })
  }

  return (
    <div className='ex-pg'>
      <div style={{height: 5}} />

      <WrapGrid onChanged={onWrapChanged} />
      <ActiveRule name={name} onClick={onSelectPresets} />

      <div style={{height: 8}} />
      <div className='rule-info'>
        NUMBER OF NEIGHBOUR CELLS REQUIRED FOR
      </div>

      <div style={{height: 4}} />
      <ExSubTitle fontSize={13} width={68}>A NEW CELL TO BE <b>B</b>ORN</ExSubTitle>
      <Numbers numbers={b} onNumbersChanged={nb => updateRule({ nb })} />

      <div style={{height: 8}} />
      <ExSubTitle fontSize={13} width={50}>AN EXISTING CELL TO <b>S</b>URVIVE</ExSubTitle>
      <Numbers numbers={s} onNumbersChanged={ns => updateRule({ ns })} />
    </div>
  )
}

const WrapGrid = ({ onChanged }) => {
  const [checked, setChecked] = useState(false)

  const updateChecked = () => {
    const _checked = !checked
    setChecked(_checked)
    onChanged(_checked)
  }

  return <ExCheckbox 
    name='Wrap Grid' 
    checked={checked}
    style={{marginTop: 10}}
    onChange={updateChecked} 
  />
}

const ActiveRule = ({ name, onClick }) => {
  return (
    <RuleOption title='Active Rule' onClick={onClick}>
      <div className='roc-lbl'>{name}</div>
      <FiChevronRight className='roc-ico roc-chev' />
    </RuleOption>
  )
}

const RuleOption = ({ children, title, onClick }) => {
  return (
    <div className='rule-opt-con' onClick={onClick}>
      {title}
      <div className='ro-ctrl'>{children}</div>
    </div>
  )
}

const Numbers = ({ numbers, onNumbersChanged }) => {
  const [toggles, setToggles] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0])

  const updateNumbers = (index, value) => {
    let numbers = ''
    toggles.map(
      (n, i) => i === index ? value : n
    ).forEach(
      (t, i) => numbers += `${t ? i : ''}`
    )
    onNumbersChanged(numbers)
  }

  useEffect(() => {
    const togs = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < numbers.length; i++) {
      togs[parseInt(numbers.charAt(i))] = 1
    }
    setToggles(togs)

  }, [numbers])

  return (
    <div className='dia-lt'>
      <DiamondBtn text={0} x={10} y={10} checked={toggles[0]} checkChanged={v => updateNumbers(0, v)} />
      <DiamondBtn text={1} x={40} y={40} checked={toggles[1]} checkChanged={v => updateNumbers(1, v)} />
      <DiamondBtn text={2} x={70} y={10} checked={toggles[2]} checkChanged={v => updateNumbers(2, v)} />
      <DiamondBtn text={3} x={100} y={40} checked={toggles[3]} checkChanged={v => updateNumbers(3, v)} />
      <DiamondBtn text={4} x={130} y={10} checked={toggles[4]} checkChanged={v => updateNumbers(4, v)} />
      <DiamondBtn text={5} x={160} y={40} checked={toggles[5]} checkChanged={v => updateNumbers(5, v)} />
      <DiamondBtn text={6} x={190} y={10} checked={toggles[6]} checkChanged={v => updateNumbers(6, v)} />
      <DiamondBtn text={7} x={220} y={40} checked={toggles[7]} checkChanged={v => updateNumbers(7, v)} />
      <DiamondBtn text={8} x={250} y={10} checked={toggles[8]} checkChanged={v => updateNumbers(8, v)} />
    </div>
  )
}

const DiamondBtn = ({ text, x, y, checked, checkChanged }) => {
  const toggleCheck = () => checkChanged(1 - checked)

  const btnStyle = { left: x , top: y }
  const btnClass = `dia-btn ${checked ? 'dia-btn-c' : ''}`
  const cbClass = `dia-cb ${checked ? 'dia-cb-c' : ''}`

  return (
    <div className={btnClass} style={btnStyle} onClick={toggleCheck} >
      <div className={cbClass} />
      <div className='dia-lbl-con'>
        <div className='dia-lbl center'>{text}</div>
      </div>
    </div>
  )
}

const RuleCell = ({ selected, name, b, s, onClick }) => {
  const nameCN = `rule-item-name ${selected ? 'rule-item-name-sel' : ''}`
  const ruleCN = `rule-item-rule ${selected ? 'rule-item-rule-sel' : ''}`

  return (
    <div 
      className='rule-item-con'
      onClick={onClick}
    >
      <div className={nameCN}>{name}</div>
      <div className={ruleCN}><b>B</b>{b} <b>S</b>{s}</div>
    </div>
  )
}

export default ExRules
