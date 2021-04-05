import { Play, Draw, Speed, Shapes, Rules, Colors, Close } from './qa-buttons'

import './quick-access.css'

const QuickAccess = ({ 
  qaHidden, isPlaying, isDrawing, 
  onQaHoverChanged, onPlayClicked, onDrawClicked 
}) => {
  return (
    <div 
      className={`base ${qaHidden ? 'base-out' : 'base-in'}`}
      onMouseEnter={() => onQaHoverChanged(true)}
      onMouseLeave={() => onQaHoverChanged(false)}
    >
      <div className='con'>
        <div className='qa-padding' />
        <Play isPlaying={isPlaying} unhide={!qaHidden} animDelay={280} onClick={onPlayClicked} />
        <Draw isDrawing={isDrawing} unhide={!qaHidden} animDelay={340} onClick={onDrawClicked} />
        <Shapes unhide={!qaHidden} animDelay={400} />
        <Rules unhide={!qaHidden} animDelay={460} />
        <Colors unhide={!qaHidden} animDelay={520} />
        <Speed unhide={!qaHidden} animDelay={580} />
        <Close unhide={!qaHidden} animDelay={640} />
        <div className='qa-padding' />
      </div>
    </div>
  )
}

export default QuickAccess
