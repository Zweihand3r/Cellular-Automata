const MouseReceiver = ({ 
  isDrawing, isPainting, 
  onBrushDown, onBrushUp,
  onDraw, onErase, onPaint, onMouseMove, onPreview 
}) => {

  /* Hooked onPreview to drawHook */
  
  const draw = (e) => onDraw(e.clientX, e.clientY)
  const erase = (e) => onErase(e.clientX, e.clientY)
  const preview = e => onPreview(e.clientX, e.clientY)
  
  const drawStart = (e) => {
    if (e.button === 0) drawHook = draw
    else if (e.button === 2) drawHook = erase
    onBrushDown()
  }
  
  const drawEnd = (e) => {
    drawHook(e)
    drawHook = () => {}
    onBrushUp()
  }
  
  const mouseMove = (e) => {
    drawHook(e)
    onMouseMove()
  }

  const clickAction = () => {
    if (isPainting) onPaint()
  }

  const contextAction = e => {
    e.preventDefault()
  }

  /* --- Init --- */
  if (isPainting) {
    drawStartHook = () => {}
    drawEndHook = () => {}
    drawHook = preview
  } else if (isDrawing) {
    drawStartHook = drawStart
    drawEndHook = drawEnd
    drawHook = () => {}
  } else {
    drawStartHook = () => {}
    drawEndHook = () => {}
    drawHook = () => {}
  }

  return (
    <div 
      className={`receiver${isDrawing || isPainting ? ' receiver-active' : ''}`}
      
      onClick={clickAction}
      onContextMenu={contextAction}
      onMouseDown={drawStartHook}
      onMouseUp={drawEndHook}
      onMouseLeave={drawEndHook}
      onMouseMove={mouseMove}
    />
  )
}
  
let drawStartHook = () => {}
let drawEndHook = () => {}
let drawHook = () => {}

export default MouseReceiver
