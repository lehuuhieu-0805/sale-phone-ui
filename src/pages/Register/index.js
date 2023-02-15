import { Button, Link, TextField } from '@mui/material';
import React from 'react';

function Register() {
  return (
    <div className='container pt-2' style={{ maxWidth: 500 }}>
      <h1>Register Page</h1>
      <form>
        <TextField label='Username' variant='outlined' fullWidth className='mt-2' />
        <TextField label='Password' variant='outlined' type='password' fullWidth className='mt-2' />
        <TextField label='Confirm Password' variant='outlined' type='password' fullWidth className='mt-2' />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, flexDirection: 'column' }}>
          <Button variant='contained' >Register</Button>
          <div style={{ marginTop: 5 }}>
            You already have an account <Link href='/login'>login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;