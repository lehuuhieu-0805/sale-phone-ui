import { Box } from '@mui/material';
import React from 'react';
import Header from './Header';

function Layouts({ children }) {
  return (
    <div>
      <Header />
      <Box component='nav' className='container' style={{ marginTop: 80 }}>
        {children}
      </Box>
    </div>
  );
}

export default Layouts;