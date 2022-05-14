export const TouchSwitch = ({ name, checked, inDelay = 0, onCheckChange }) => (
  <div 
    className='to-control-con'
    style={{ animationDelay: `${inDelay}ms` }}
  >
    <div className='to-c-label'>
      {name}
    </div>
    <div 
      className='to-c-switch' 
      onClick={() => onCheckChange(!checked)}
    >
      <div className='to-c-s-track center'>
        <div className={`to-c-s-handle ${checked && 'to-c-s-h-checked'}`} />
      </div>
    </div>
  </div>
)

export const TouchButton = ({ name, onClick, extraMargin = false, inDelay = 0 }) => (
  <div 
    className={`to-control-con to-c-button ${extraMargin && 'to-c-b-extra-margin'}`}
    style={{ animationDelay: `${inDelay}ms` }}
    onClick={onClick}
  >
    <div>{name}</div>
  </div>
)