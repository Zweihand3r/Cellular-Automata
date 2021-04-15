import { useState, useContext } from 'react'
import { Context } from '../../context/Context'

import { ExCon } from './ex-comps'

const ExRules = ({ isCurrent }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { rules } = useContext(Context)

  return (
    <ExCon title='Rules' isCurrent={isCurrent}>
      {rules.map(({name, b, s}, index) => 
      <RuleCell selected={currentIndex === index} name={name} b={b} s={s} onClick={() => setCurrentIndex(index)} />)}
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
