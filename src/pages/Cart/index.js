import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { api } from './../../constants';

function Cart() {
  const [cart, setCart] = useState([]);
  const [reloadCart, setReloadCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const token = localStorage.getItem('token');
  let decodeToken = null;
  if (token) {
    decodeToken = jwtDecode(token);
  } else {
    window.location.href = '/home';
  }

  useEffect(() => {
    if (token) {
      axios({
        method: 'GET',
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/carts/${decodeToken.username}`
      }).then((res) => {
        setCart(res.data);

        let totalPriceTemp = 0;
        let totalQuantityTemp = 0;
        res.data.forEach((item) => {
          totalPriceTemp += item.price * item.quantity;
          totalQuantityTemp += item.quantity;
        });

        setTotalPrice(totalPriceTemp);
        setTotalQuantity(totalQuantityTemp);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      window.location.href = '/home';
    }

  }, [decodeToken.username, reloadCart, token]);

  const handleIncreaseQuantity = (item) => {
    axios({
      method: 'POST',
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/carts?type=up`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        status: item.status
      }
    }).then(() => {
      setReloadCart(!reloadCart);
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleReduceQuantity = (item) => {
    axios({
      method: 'POST',
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/carts?type=down`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        status: item.status
      }
    }).then(() => {
      setReloadCart(!reloadCart);
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <>
      <Typography variant='h5'>Cart</Typography>
      <TableContainer component={Paper} className='mt-2'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell align='center'>Name</TableCell>
              <TableCell align='center'>Unit Price</TableCell>
              <TableCell align='center'>Quantity</TableCell>
              <TableCell align='center'>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.length > 0
              ? <>
                {cart.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell scope='row'>{index + 1}</TableCell>
                    <TableCell align='center'>{item.name}</TableCell>
                    <TableCell align='center'>{item.price}</TableCell>
                    <TableCell align='center'>
                      <RemoveCircleOutlineIcon sx={{
                        '&:hover': {
                          cursor: 'pointer'
                        }
                      }} onClick={() => handleReduceQuantity(item)} />
                      <span style={{ marginRight: 10, marginLeft: 10 }}>{item.quantity}</span>
                      <AddCircleOutlineIcon sx={{
                        '&:hover': {
                          cursor: 'pointer'
                        }
                      }} onClick={() => handleIncreaseQuantity(item)} />
                    </TableCell>
                    <TableCell align='center'>{item.price * item.quantity}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align='center' colSpan={3} style={{ fontWeight: 'bold' }}>Total:</TableCell>
                  <TableCell align='center'>{totalQuantity}</TableCell>
                  <TableCell align='center'>{totalPrice}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='right' colSpan={5}>
                    <Button color='success' variant='contained'>Check out</Button>
                  </TableCell>
                </TableRow>
              </>
              : (<TableRow>
                <TableCell colSpan={5} style={{ fontWeight: 'bold', textAlign: 'center' }}>No records found</TableCell>
              </TableRow>)
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Cart;