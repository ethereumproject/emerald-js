import * as React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const ArrowLeftBoxed: React.ComponentType<SvgIconProps> = (props) => (
  <SvgIcon style={{fill:'none'}} stroke="currentColor" fill="none" strokeWidth="4" viewBox="0 0 64 64" {...props} >
    <path d="M36 24l-8 8 8 8"/><path d="M8 8h48v48H8z"/>
  </SvgIcon>
);

export default ArrowLeftBoxed;
