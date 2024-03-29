const QaTooltip = ({ vis, index }) => {
  const startX = (window.innerWidth - 324) / 2
  const midX = startX + 8 + (44 * index) + 22
  const path = `M ${midX - 12} 8 L ${midX} 0 L ${midX + 12} 8`
  const msgConStyle = { left: midX }

  const className = `qa-tt-con ${vis ? 'qa-tt-con-in' : ''}`
  const tip = tips[index]

  return (
    <div className={className}>
      <svg className='qa-tt-svg'>
        <path d={path} fill='#dfdfdf' />
      </svg>
      <div className='qa-tt-msg-con' style={msgConStyle}>
        <div className='qa-tt-msg'>{tip}</div>
      </div>
    </div>
  )
}

const tips = {
  0: ['Play | Pause'],
  1: ['LMB: Toggle Brush | RMB: Brush Size'],
  2: ['LMB: Pattern List | RMB: Grid Cell Size'],
  3: ['LMB: Configure Rules | RMB: Rule Presets'],
  4: ['LMB: Color Palette | RMB: Age Based Palette'],
  5: ['Sim Speed'],
  6: ['LMB: Close | RMB: Minimise']
}

export default QaTooltip
