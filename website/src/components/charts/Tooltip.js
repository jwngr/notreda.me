import React from 'react';

import './Tooltip.css';

const Tooltip = ({x, y, children}) => {
  return (
    <div className="tooltip" style={{top: y, left: x}}>
      {children}
    </div>
  );
};

export default Tooltip;
