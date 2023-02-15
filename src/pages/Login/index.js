import { Button, TextField, Link } from '@mui/material';
import React from 'react';

function Login() {
  return (
    <div className='container pt-2' style={{ maxWidth: 500 }}>
      <h1>Login Page</h1>
      <form>
        <TextField label='Username' variant='outlined' fullWidth className='mt-2' />
        <TextField label='Password' variant='outlined' type='password' fullWidth className='mt-2' />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, flexDirection: 'column' }}>
          <Button variant='contained' >Login</Button>
          <div style={{ marginTop: 5 }}>
            You don't have an account <Link href='/register'>register an account</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;