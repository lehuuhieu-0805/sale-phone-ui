import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { api } from '../../constants';
import { formatDate } from '../../utils/formatDate';
import convertDriveURL from '../../utils/getIdByDriveUrl';

function HistoryOrder() {
  const [listHistoryOrder, setListHistoryOrder] = useState([]);

  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/orders`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res);
      setListHistoryOrder(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }, [token]);

  return (
    <>
      <Typography variant='h5' style={{ marginBottom: 10 }}>History Order</Typography>
      {listHistoryOrder.length > 0 ? listHistoryOrder.map((historyOrder) => (
        <div style={{ border: 'groove', marginTop: 10 }}>
          {historyOrder.orderItems.map((orderItem) => (
            <>
              <Card sx={{ marginBottom: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <CardMedia image={convertDriveURL({ url: orderItem.phone.image })} component='img' sx={{ width: 200 }} referrerpolicy="no-referrer" />
                  </Grid>
                  <Grid item xs={10}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <CardContent>
                        <Typography variant='body1'>{orderItem.phone.name}</Typography>
                      </CardContent>
                      <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='subtitle2'>x{orderItem.quantity}</Typography>
                        <Typography variant='subtitle2' color='red'>{orderItem.price}$</Typography>
                      </CardContent>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='subtitle2'>Date Created: {formatDate(historyOrder.dateCreated)}</Typography>
            <Typography variant='subtitle1' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              Order Total: <Typography color='red'>{historyOrder.totalPrice}$</Typography>
            </Typography>
          </div>
        </div>
      )) : <Typography variant='h5' fontWeight='bold'>No records found</Typography>}
    </>
  );
}

export default HistoryOrder;