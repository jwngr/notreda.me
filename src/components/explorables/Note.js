import React from 'react';

import './Note.css';

const Note = ({children}) => {
  return (
    <div className="note">
      <div className="note-header-container">
        <p className="note-header">Note</p>
      </div>
      <p className="note-text">{children}</p>
    </div>
  );
};

export default Note;
