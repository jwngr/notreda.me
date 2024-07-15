// Note: This is in a separate file because it imports React. Since models are shared with /scripts
// directory, we need to make sure nothing it imports also imports React.
import React from 'react';

export interface StyleAttributes {
  readonly style?: React.CSSProperties;
  readonly className?: string;
}
