import * as React from 'react';
import { Loader as LoaderComponent } from '@strapi/design-system';

const Loader = () => {
  const style: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 0.6)',
    zIndex: 1,
    alignItems: 'center',
  };

  return (
    <div style={style}>
      <LoaderComponent>Loading content...</LoaderComponent>
    </div>
  );
};

export default Loader;
