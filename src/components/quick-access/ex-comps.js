import { useState, useRef, useEffect } from 'react'
import { IoMdCheckboxOutline, IoMdSquareOutline } from 'react-icons/io'

/* Need to adjust width if any changes to qa */
const width = 324 * 2

const ExCon = ({ title, isCurrent, children }) => {
  return (
    <div className={`ex-con ex-con-${isCurrent ? 'in' : 'out'}`}>
      <div className='ex-title'>
        <div className='ex-title-lbl center'>
          {title.split('').join(' ').toUpperCase()}
        </div>
      </div>
      <div className='ex-cont'>
        {children}
      </div>
    </div>
  )
}

const ExIndicator = (props) => {
  const { selectedIndex } = props
  const canvasRef = useRef(null)

  const style = {
    width, left: (8 - width / 2 + 22) + (44 * selectedIndex)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.setAttribute('width', width)
    canvas.setAttribute('height', 444)

    ctx.lineWidth = 2
    ctx.strokeStyle = '#a2a2a2'

    const points = [[width / 2 - 10, 400], [width / 2, 406], [width / 2 + 10, 400], [width, 400]]

    ctx.moveTo(0, 400)
    points.forEach(([x, y]) => ctx.lineTo(x, y))
    ctx.stroke()

  }, [])

  return (
    <canvas className='ex-indic' ref={canvasRef} style={style} />
  )
}

const ExSubTitle = ({ 
  children,
  subtitle, fontSize = 10,
  width, isScrollable = false, 
  left = 0, right = 0 
}) => {
  const className = `ex-st-con ex-item-${isScrollable ? 'scrl' : 'con'}`

  return (
    <div className={className} style={{height: fontSize + 3}}>
      <div className='ex-st-hr' style={{ width, left }} />
      <div className='ex-st-lbl' style={{ fontSize }}>
        {subtitle ? subtitle.toUpperCase() : children}
      </div>
      <div className='ex-st-hr' style={{ width, right }} />
    </div>
  )
}

const ExCheckbox = ({ name, checked, style = {}, onChange }) => {
  return (
    <div 
      className='ex-cb-con' style={style} 
      onClick={() => onChange(!checked)}
    >
      {name}
      {checked ? 
      <IoMdCheckboxOutline className='ex-cb-ico' /> : 
      <IoMdSquareOutline className='ex-cb-ico' />}
    </div>
  )
}

const ExHexButton = ({ name, x, y, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const mouseLeave = _ => {
    setHovered(false)
    setPressed(false)
  }

  const fill = pressed ? '#fff' : '#00000000'
  const stroke = hovered ? '#fff' : '#a2a2a2'
  const textStyle = { color: pressed ? '#000' : stroke }

  return (
    <div
      className='ex-hb-con'
      style={{left: x, top: y}}
      onMouseEnter={_ => setHovered(true)}
      onMouseLeave={mouseLeave}
      onMouseDown={_ => setPressed(true)}
      onMouseUp={_ => setPressed(false)}
      onClick={onClick}
    >
      <svg className='ex-hb-svg'>
        <path d='M 0 13 L 10 0 L 134 0 L 144 13 L 134 26 L 10 26 Z' fill={fill} />
        <path d='M 1 13 L 10 0 M 133 0 L 142 13 L 133 26 M 10 26 L 0 13' strokeWidth={1.5} stroke={stroke} fill='#00000000' />
        <path d='M 10 0 L 134 0 M 133 26 L 10 26' strokeWidth={2.5} stroke={stroke} />
      </svg>
      <div className='ex-hb-lbl center' style={textStyle}>{name}</div>
    </div>
  )
}

export { ExCon, ExIndicator, ExSubTitle, ExCheckbox, ExHexButton }