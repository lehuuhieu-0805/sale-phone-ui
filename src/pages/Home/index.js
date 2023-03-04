import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from './../../components/AlertMessage';
import { api } from './../../constants';
import { updateQuantityCart } from './../../stores/quantityCart';
import convertDriveURL from './../../utils/getIdByDriveUrl';

function Home() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);

  const [listPhone, setListPhone] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/phones?status=active`,
    }).then((res) => {
      setListPhone(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const handleAddToCart = (phone) => {
    if (currentUser) {
      axios({
        method: 'GET',
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/phones/${phone.id}`,
      }).then((res) => {
        axios({
          method: 'POST',
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/carts?type=up`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          data: {
            id: res.data.id,
            name: res.data.name,
            price: res.data.price,
            quantity: 1,
            image: res.data.image,
            status: res.data.status
          }
        }).then(() => {

          axios({
            method: 'GET',
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/carts/${currentUser.username}`,
          }).then((res) => {
            console.log(res);
            const action = updateQuantityCart(res.data.length);
            dispatch(action);

            setSeverity('success');
            setMessageAlert('Add to cart successfully');
            setOpenAlert(true);
          }).catch((error) => {
            console.log(error);
          });

        }).catch((error) => {
          console.log(error);
          setSeverity('error');
          setMessageAlert('Add to cart failed');
          setOpenAlert(true);
        });
      }).catch((error) => {
        console.log(error);
        setSeverity('error');
        setMessageAlert('Add to cart failed');
        setOpenAlert(true);
      });
    } else {
      setSeverity('error');
      setMessageAlert('Please login to add to cart');
      setOpenAlert(true);
    }
  };

  return (
    <div className='mt-2'>
      {listPhone.length > 0
        ? <Grid container spacing={2}>
          {listPhone.map((phone, index) => (
            <Grid item xs={3} key={index}>
              <Card sx={{ maxWidth: 300, mr: 2 }}>
                <CardMedia
                  component='img'
                  height='140'
                  image={convertDriveURL({ url: phone.image })}
                  alt={phone.name}
                />
                <CardContent>
                  <Typography variant='h5' component='div'>
                    {phone.name}
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body1' fontWeight='bold'>
                      Price: {phone.price}$
                    </Typography>
                    <Typography variant='body1'>
                      Quantity: {phone.quantity}
                    </Typography>
                  </div>
                </CardContent>
                <CardActions>
                  <Button onClick={() => handleAddToCart(phone)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        : <Typography style={{ fontWeight: 'bold', textAlign: 'center' }}>No records found</Typography>
      }

      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={messageAlert} severity={severity} />
    </div>
  );
};

export default Home;