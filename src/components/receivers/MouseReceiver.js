const MouseReceiver = ({ isDrawing, onDraw, onErase, onMouseMove }) => {
  
  const draw = (e) => onDraw(e.clientX, e.clientY)
  const erase = (e) => onErase(e.clientX, e.clientY)
  
  const drawStart = (e) => {
    if (e.button === 0) drawHook = draw
    else if (e.button === 2) drawHook = erase
  }
  
  const drawEnd = (e) => {
    drawHook(e)
    drawHook = () => {}
  }
  
  let drawStartHook = () => {}
  let drawEndHook = () => {}
  let drawHook = () => {}
  
  const mouseMove = (e) => {
    drawHook(e)
    onMouseMove()
  }

  /* --- Init --- */
  if (isDrawing) {
    drawStartHook = drawStart
    drawEndHook = drawEnd
  } else {
    drawStartHook = () => {}
    drawEndHook = () => {}
    drawHook = () => {}
  }

  return (
    <div 
      className={`receiver${isDrawing ? ' receiver-active' : ''}`}
      
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={drawStartHook}
      onMouseUp={drawEndHook}
      onMouseLeave={drawEndHook}
      onMouseMove={mouseMove}
    />
  )
}

export default MouseReceiver
