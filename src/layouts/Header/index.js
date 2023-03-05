/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from './../../constants';
import { removeQuantityCart, updateQuantityCart } from './../../stores/quantityCart';
import { removeUser, saveUser } from './../../stores/userSlice';
import Login from './Login';
import Register from './Register';

function Header() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);
  const quantityCart = useSelector(state => state.quantityCart);
  const token = localStorage.getItem('token');

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);

  useEffect(() => {
    if (!token) {
      let action = removeUser();
      dispatch(action);

      action = updateQuantityCart(0);
      dispatch(action);
    } else {
      axios({
        method: 'GET',
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/auth/profile`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        const action = saveUser(res.data);
        dispatch(action);

        axios({
          method: 'GET',
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/carts/${res.data.username}`,
        }).then((res) => {
          const action = updateQuantityCart(res.data.length);
          dispatch(action);
        }).catch((error) => {
          console.log(error);
        });

      }).catch((error) => {
        console.log(error);
        if (error.response.data.message === 'Unauthorized') {
          localStorage.clear();
        }
      });
    };
  }, []);

  const handleChangeDialogMode = (mode) => {
    if (mode === 'login') {
      setOpenLoginDialog(true);
      setOpenRegisterDialog(false);
    } else {
      setOpenLoginDialog(false);
      setOpenRegisterDialog(true);
    }
  };

  return (
    <Box >
      {/* <nav class='navbar navbar-expand-lg bg-body-tertiary'>
        <div class='container-fluid'>
          <a class='navbar-brand'>Sale Phone</a>
          <button class='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
            <span class='navbar-toggler-icon'></span>
          </button>
          <div class='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul class='navbar-nav me-auto mb-2 mb-lg-0'>
              <li class='nav-item'>
                <a class='nav-link active' aria-current='page' href='/home'>Home</a>
              </li>
            </ul>
            <div className='d-flex'>
              {currentUser
                ? (<>
                  {currentUser.role === 'USER' ? (
                    <>
                      <div className='cart-icon' style={{ position: 'relative' }}>
                        <span className='count' style={{ position: 'absolute', right: 8, color: 'red', fontWeight: 'bold' }}>{quantityCart}</span>
                        <ShoppingCartOutlinedIcon style={{
                          marginTop: 8, marginRight: 16
                        }} sx={{
                          '&:hover': {
                            cursor: 'pointer'
                          }
                        }} onClick={() => {
                          window.location.href = '/cart';
                        }} />
                      </div>
                      <Button variant='contained' color='primary' style={{ marginRight: 10 }} onClick={() => {
                        window.location.href = '/history-order';
                      }}>
                        History Order
                      </Button>
                    </>
                  ) : null}
                  <a class='navbar-brand' style={{ fontWeight: 'bold' }}>{currentUser.username}</a>
                  <button class='btn btn-outline-success' onClick={() => {
                    localStorage.clear();
                    let action = removeUser();
                    dispatch(action);

                    action = removeQuantityCart();
                    dispatch(action);
                    window.location.href = '/home';
                  }}>Logout</button>
                </>)
                : (<button class='btn btn-primary' onClick={() => setOpenLoginDialog(true)}>Login</button>)}
            </div>
          </div>
        </div>
      </nav> */}

      <AppBar component='nav' >
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ mr: 2 }}>
              Sale Phone
            </Typography>
            <Typography variant="body2" component="div" sx={{
              '&:hover': {
                cursor: 'pointer'
              }
            }} onClick={() => {
              window.location.href = '/home';
            }}>
              Home
            </Typography>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            {currentUser
              ? (<>
                {currentUser.role === 'USER'
                  ? (<>
                    <div className='cart-icon' style={{ position: 'relative' }}>
                      <span className='count' style={{ position: 'absolute', right: 8, color: 'red', fontWeight: 'bold' }}>{quantityCart}</span>
                      <ShoppingCartOutlinedIcon style={{
                        marginTop: 8, marginRight: 16
                      }} sx={{
                        '&:hover': {
                          cursor: 'pointer'
                        }
                      }} onClick={() => {
                        window.location.href = '/cart';
                      }} />
                    </div>
                    <Button variant='contained' color="info" style={{ marginRight: 10 }} onClick={() => {
                      window.location.href = '/history-order';
                    }}>
                      History Order
                    </Button>
                  </>)
                  : null}
                <Typography variant='subtitle1' fontWeight='bold' color='inherit' style={{ marginRight: 10 }}>{currentUser.username}</Typography>
                <Button color="error" variant='contained' onClick={() => {
                  localStorage.clear();
                  let action = removeUser();
                  dispatch(action);

                  action = removeQuantityCart();
                  dispatch(action);
                  window.location.href = '/home';
                }}>Logout</Button>
              </>)
              : (<Button color="inherit" onClick={() => setOpenLoginDialog(true)}>Login</Button>)}
          </Box>
        </Toolbar>
      </AppBar>

      <Login open={openLoginDialog} setOpen={setOpenLoginDialog} handleChangeDialogMode={handleChangeDialogMode} />
      <Register open={openRegisterDialog} setOpen={setOpenRegisterDialog} handleChangeDialogMode={handleChangeDialogMode}></Register>
    </Box>
  );
}

export default Header;