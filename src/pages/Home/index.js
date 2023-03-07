import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import AlertMessage from './../../components/AlertMessage';
import { api } from './../../constants';
import { updateQuantityCart } from './../../stores/quantityCart';
import convertDriveURL from './../../utils/getIdByDriveUrl';
import { LoadingButton } from '@mui/lab';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  price: yup.number().required('Price is required').typeError('Price is required').positive('Price must be greater than 0'),
  quantity: yup.number().required('Quantity is required').typeError('Quantity is required').positive('Quantity must be greater than 0'),
});

function Home() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);

  const token = localStorage.getItem('token');
  let decodeToken = null;
  let role = null;
  if (token) {
    decodeToken = jwtDecode(token);
    role = decodeToken.role;
  }

  const [listPhone, setListPhone] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState({
    file: null,
    error: false
  });
  const [reloadData, setReloadData] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [phone, setPhone] = useState(null);

  const defaultValues = {
    name: '',
    price: '',
    quantity: '',
  };

  const method = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  const { handleSubmit, register, formState: { errors }, reset, setValue } = method;

  useEffect(() => {
    if (role === 'ADMIN') {
      axios({
        method: 'GET',
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/phones`,
      }).then((res) => {
        setListPhone(res.data);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      axios({
        method: 'GET',
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/phones?status=active`,
      }).then((res) => {
        setListPhone(res.data);
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [role, reloadData]);

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

  const onSubmit = (data) => {
    console.log(data);
    setLoadingButton(true);

    // update a phone
    if (phone) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('quantity', data.quantity);
      if (image.file) {
        formData.append('image', image.file);
      }
      formData.append('status', phone.status);

      axios({
        method: 'PUT',
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/phones/${phone.id}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: formData
      }).then(() => {
        setSeverity('success');
        setMessageAlert('Update a phone successfully');
        setOpenAlert(true);
        setLoadingButton(false);
        setOpenDialog(false);
        setPhone(null);
        if (image) {
          setImage({
            file: null,
            error: false
          });
        }
        setImagePreview(null);
        setReloadData(!reloadData);
        reset();
      }).catch((error) => {
        console.log(error);
        setSeverity('error');
        setMessageAlert('Update a phone failed');
        setOpenAlert(true);
        setLoadingButton(false);
        setOpenDialog(false);
        setPhone(null);
      });

    } else {
      // create a new phone
      if (image.file === null) {
        setImage({
          file: null,
          error: true
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('quantity', data.quantity);
      formData.append('image', image.file);
      formData.append('status', 'ACTIVE');

      axios({
        method: 'POST',
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/phones`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: formData
      }).then(() => {
        setReloadData(!reloadData);
        setSeverity('success');
        setMessageAlert('Create a phone successfully');
        setOpenAlert(true);
        setLoadingButton(false);
        setOpenDialog(false);
        reset();
        setImage({
          file: null,
          error: false
        });
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
      }).catch((error) => {
        console.log(error);
        setSeverity('error');
        setMessageAlert('Create a phone failed');
        setOpenAlert(true);
        setLoadingButton(false);
      });
    }
  };

  const onError = (data) => {
    console.log(data);
    if (image.file === null) {
      setImage({
        file: null,
        error: true
      });
    }
  };

  const handleGetPhone = (phone) => {
    axios({
      method: 'GET',
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/phones/${phone.id}`,
    }).then((res) => {
      setPhone(res.data);
      setValue('name', res.data.name);
      setValue('price', res.data.price);
      setValue('quantity', res.data.quantity);
      setImagePreview(convertDriveURL({ url: res.data.image }));
      setOpenDialog(true);
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className='mt-2'>
      {role === 'ADMIN' ? (
        <>
          <Button style={{ float: 'right', marginBottom: 10 }} variant='contained' color='primary' onClick={() => {
            setOpenDialog(true);
          }}>
            Create
          </Button>
          <TableContainer component={Paper} className='mt-2 mb-4'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell align='center'>Name</TableCell>
                  <TableCell align='center'>Price</TableCell>
                  <TableCell align='center'>Quantity</TableCell>
                  <TableCell align='center'>Image</TableCell>
                  <TableCell align='center'>Status</TableCell>
                  <TableCell align='center'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listPhone.length > 0
                  ? <>
                    {listPhone.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell scope='row'>{index + 1}</TableCell>
                        <TableCell align='center'>{item.name}</TableCell>
                        <TableCell align='center'>{item.price}$</TableCell>
                        <TableCell align='center'>{item.quantity}</TableCell>
                        <TableCell align='center'>
                          <img src={convertDriveURL({ url: item.image })} alt={item.name} width='150' referrerpolicy="no-referrer" />
                        </TableCell>
                        <TableCell align='center'>{item.status}</TableCell>
                        <TableCell align='center'>
                          <Button variant='outlined' color='info' onClick={() => handleGetPhone(item)}>Update</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                  : (<TableRow>
                    <TableCell colSpan={5} style={{ fontWeight: 'bold', textAlign: 'center' }}>No records found</TableCell>
                  </TableRow>)
                }
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={() => {
            setOpenAlert(false);
            if (imagePreview) {
              URL.revokeObjectURL(imagePreview);
            }
          }} fullWidth maxWidth='sm'>
            <DialogTitle>{phone ? 'Update a phone' : 'Create a phone'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <DialogContent style={{ paddingTop: 10 }}>
                <TextField label='Name' {...register('name')} fullWidth />
                <p style={{ color: 'red' }}>{errors.name?.message}</p>
                <TextField style={{ marginTop: 10 }} label='Price' type='number' {...register('price')} fullWidth />
                <p style={{ color: 'red' }}>{errors.price?.message}</p>
                <TextField style={{ marginTop: 10 }} label='Quantity' type='number' {...register('quantity')} fullWidth />
                <p style={{ color: 'red' }}>{errors.quantity?.message}</p>
                {phone ? (
                  <FormControl fullWidth>
                    <Select
                      value={phone.status}
                      onChange={(e) => {
                        setPhone({
                          ...phone,
                          status: e.target.value
                        });
                      }}
                    >
                      <MenuItem value='ACTIVE'>Active</MenuItem>
                      <MenuItem value='IN_ACTIVE'>In active</MenuItem>
                    </Select>
                  </FormControl>
                ) : null}
                <label htmlFor='upload-image' style={{ marginTop: 10 }}>
                  <input id='upload-image' name='upload-image' type='file' style={{ display: 'none' }} onChange={(e) => {
                    const preview = URL.createObjectURL(e.target.files[0]);
                    setImagePreview(preview);
                    setImage({
                      file: e.target.files[0],
                      error: false
                    });
                  }} />
                  <Button variant='contained' color='primary' component='span'>Upload image</Button>
                </label>
                {image.error ? (<p style={{ color: 'red' }}>Image is required</p>) : null}
                {imagePreview ? (<img src={imagePreview} alt='hinh anh' style={{ marginTop: 10 }} width={535} referrerpolicy="no-referrer" />) : null}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setOpenDialog(false);
                  reset();
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setImagePreview(null);
                  if (image.file) {
                    setImage({
                      file: null,
                      error: false
                    });
                  }
                  if (phone) {
                    setPhone(null);
                  }
                }} variant='outlined'>Cancel</Button>
                <LoadingButton loading={loadingButton} variant='contained' color='success' type='submit'>{phone ? 'Update' : 'Create'}</LoadingButton>
              </DialogActions>
            </form>
          </Dialog>
        </>
      ) : (
        <>
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
                      referrerpolicy="no-referrer"
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
        </>
      )}

      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={messageAlert} severity={severity} />
    </div >
  );
};

export default Home;