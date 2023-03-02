import { yupResolver } from '@hookform/resolvers/yup';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, Dialog, DialogContent, DialogTitle, Link, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import AlertMessage from '../../../components/AlertMessage';
import { api } from '../../../constants';
import { save } from '../../../stores/userSlice';

const LoginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});

function Login({ open, setOpen, handleChangeDialogMode }) {
  const dispatch = useDispatch();

  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');

  const defaultValues = {
    username: '',
    password: '',
  };

  const method = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
    mode: 'onChange'
  });

  const { handleSubmit, register, formState: { errors }, reset } = method;

  const onSubmit = (data) => {
    axios({
      method: 'POST',
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/auth/login`,
      data: {
        username: data.username,
        password: data.password,
      }
    }).then((res) => {
      console.log(res);
      localStorage.setItem('token', res.data.access_token);
      axios({
        method: 'GET',
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/auth/profile`,
        headers: {
          Authorization: `Bearer ${res.data.access_token}`
        }
      }).then((res) => {
        const action = save(res.data);
        dispatch(action);
        setSeverity('success');
        setMessageAlert('Login successfully');
        setOpenAlert(true);
        setOpen(false);
        reset();
      }).catch((error) => {
        console.log(error);
        setSeverity('error');
        setMessageAlert(error.response.data.message);
        setOpenAlert(true);
      });
    }).catch((error) => {
      console.log(error);
      if (error.response.data.statusCode === 401) {
        setSeverity('error');
        setMessageAlert('Username or password is incorrect');
        setOpenAlert(true);
        return;
      }
      setSeverity('error');
      setMessageAlert('Login failed');
      setOpenAlert(true);
    });
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontWeight: 'bold' }}>Login</p>
          <HighlightOffIcon style={{ cursor: 'pointer' }} onClick={() => {
            setOpen(false);
            reset();
          }} />
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register('username')} label='Username' variant='outlined' fullWidth className='mt-2' />
            <p style={{ color: 'red' }}>{errors.username?.message}</p>
            <TextField {...register('password')} label='Password' variant='outlined' type='password' fullWidth className='mt-2' />
            <p style={{ color: 'red' }}>{errors.password?.message}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, flexDirection: 'column' }}>
              <Button variant='contained' type='submit'>Login</Button>
              <div style={{ marginTop: 5 }}>
                You don't have an account <Link onClick={() => {
                  handleChangeDialogMode('register');
                  reset();
                }} sx={{
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}>register an account</Link>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={messageAlert} severity={severity} />
    </>
  );
}

export default Login;