import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HistoryOrder from '../pages/HistoryOrder';
import { Cart, Home } from './../pages';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/home' element={<Home />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/history-order' element={<HistoryOrder />} />
    </Routes>
  );
}

export default Router;