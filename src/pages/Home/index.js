import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { api } from './../../constants';
import convertDriveURL from './../../utils/getIdByDriveUrl';

function Home() {
  const [listPhone, setListPhone] = useState([]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/phones`,
    }).then((res) => {
      setListPhone(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div className='mt-2'>
      <Grid container spacing={2}>
        {listPhone.map((phone) => (
          <Grid item xs={3}>
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
                <Typography variant='body1' fontWeight='bold'>
                  {phone.price}$
                </Typography>
              </CardContent>
              <CardActions>
                <Button>
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;