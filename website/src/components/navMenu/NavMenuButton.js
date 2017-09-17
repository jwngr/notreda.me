import React from 'react';

import './NavMenuButton.css';


const NavMenuButton = ({ onClick }) => (
  <div className='nav-menu-button nav-menu-open-button' onClick={ onClick }>
    <span></span>
  </div>
);

export default NavMenuButton;
