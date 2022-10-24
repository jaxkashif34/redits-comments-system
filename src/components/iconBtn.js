import React from 'react';

const IconBtn = ({ Icon, isActive, color, children, ...props }) => {
  return (
    <div className={`btn icon-btn ${isActive && 'icon-btn-icon'} ${color || ''}`} {...props}>
      <span className={`${children != null && 'mr-1'}`}>{<Icon />}</span>
      {children}
    </div>
  );
};

export default IconBtn;
