import * as React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const ZoomOut: React.ComponentType<SvgIconProps> = (props) => (
  <SvgIcon style={{fill:'none'}} stroke="currentColor" fill="none" strokeWidth="4" viewBox="0 0 64 64" {...props} >
    <circle cx="28" cy="28" r="20"/><path d="M56 56L42.14 42.14M16 28h24"/>
  </SvgIcon>
);

export default ZoomOut;
