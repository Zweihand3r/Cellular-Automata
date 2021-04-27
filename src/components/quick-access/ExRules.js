import { useState, useContext } from 'react'
import { Context } from '../../context/Context'

import { ExCon } from './ex-comps'

const ExRules = ({ isCurrent, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { rules } = useContext(Context)

  const clickAction = (index) => {
    const rule = rules[index]
    setCurrentIndex(index)
    onSelect(rule)
  }

  return (
    <ExCon title='Rules' isCurrent={isCurrent}>
      <div className='ex-flick'>
        {rules.map(({name, b, s}, index) => 
        <RuleCell key={index} selected={currentIndex === index} name={name} b={b} s={s} onClick={() => clickAction(index)} />)}
      </div>
    </ExCon>
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
