import { Button, TextField, Link } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AlertMessage from '../../components/AlertMessage';
import { api } from '../../constants';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

const LoginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});

function Login() {
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

  const { handleSubmit, register, formState: { errors } } = method;

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
      setSeverity('success');
      setMessageAlert('Login successfully');
      setOpenAlert(true);
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
    <div className='container pt-2' style={{ maxWidth: 500 }}>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register('username')} label='Username' variant='outlined' fullWidth className='mt-2' />
        <p style={{ color: 'red' }}>{errors.username?.message}</p>
        <TextField {...register('password')} label='Password' variant='outlined' type='password' fullWidth className='mt-2' />
        <p style={{ color: 'red' }}>{errors.password?.message}</p>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, flexDirection: 'column' }}>
          <Button variant='contained' type='submit'>Login</Button>
          <div style={{ marginTop: 5 }}>
            You don't have an account <Link href='/register'>register an account</Link>
          </div>
        </div>
      </form>

      <AlertMessage openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={messageAlert} severity={severity} />
    </div>
  );
}

export default Login;