import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

function Loading() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <CircularProgress />
    </div>
  );
}

export default Loading;
