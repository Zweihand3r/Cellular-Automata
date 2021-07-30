import { useRef, useEffect } from 'react'
import { IoMdCheckboxOutline, IoMdSquareOutline } from 'react-icons/io'

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

  /* Need to adjust width if any changes to qa */
  const width = 324 * 2

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

  }, [null])

  return (
    <canvas className='ex-indic' ref={canvasRef} style={style} className='ex-indic' />
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

export { ExCon, ExIndicator, ExSubTitle, ExCheckbox }