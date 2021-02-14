import React, { useState, useEffect } from 'react'
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";

export function Movie () {
    const [name, setName] = useState('')
  return (
      <Card>
          <CardHeader
              title={'title'}
              subheader={`subtitle`}
          />
          <CardContent>
              <Grid container>
                  <Grid item xs={12}>
                      <Typography variant="body2" color="textPrimary" component="p">
                          {'overview'}
                      </Typography>
                  </Grid>
              </Grid>
          </CardContent>
      </Card>
  )
}
