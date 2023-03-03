import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Cart, Home } from './../pages';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/home' element={<Home />} />
      <Route path='/cart' element={<Cart />} />
    </Routes>
  );
}

export default Router;