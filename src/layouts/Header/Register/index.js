import { yupResolver } from '@hookform/resolvers/yup';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, Dialog, DialogContent, DialogTitle, Link, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AlertMessage from './../../../components/AlertMessage';
import { api } from './../../../constants';

const RegisterSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string().required('Confirm password is required').oneOf([yup.ref('password'), null], 'Passwords must match'),
});

function Register({ open, setOpen, handleChangeDialogMode }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [severity, setSeverity] = useState('success');

  const defaultValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const method = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
    mode: 'onChange'
  });

  const { handleSubmit, register, formState: { errors }, reset } = method;

  const onSubmit = (data) => {
    axios({
      method: 'POST',
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/auth/register`,
      data: {
        username: data.username,
        password: data.password,
      }
    }).then((res) => {
      console.log(res);
      setSeverity('success');
      setMessageAlert('Register an account successfully');
      setOpenAlert(true);
      setOpen(false);
      reset();
    }).catch((error) => {
      console.log(error);
      if (error.response.data.message === 'Username already exists') {
        setSeverity('error');
        setMessageAlert(error.response.data.message);
        setOpenAlert(true);
        return;
      }
      setSeverity('error');
      setMessageAlert('Register an account failed');
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
          <h5 style={{ fontWeight: 'bold' }}>Register An Account</h5>
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
            <TextField {...register('confirmPassword')} label='Confirm Password' variant='outlined' type='password' fullWidth className='mt-2' />
            <p style={{ color: 'red' }}>{errors.confirmPassword?.message}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, flexDirection: 'column' }}>
              <Button variant='contained' type='submit'>Register</Button>
              <div style={{ marginTop: 5 }}>
                You already have an account <Link onClick={() => {
                  handleChangeDialogMode('login');
                  reset();
                }} sx={{
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}>login</Link>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={messageAlert} severity={severity} />
    </>
  );
}

export default Register;