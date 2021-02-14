import React from 'react'
import Box from '@material-ui/core/Box';
import {Button, Card, Container, TextField} from "@material-ui/core";
import logo from '../box.png';
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import {displayVerticalSpace} from "../helpers/helpers"; // Tell webpack this JS file uses this image


export function Suggestions () {
    return (
        <Container maxWidth="md">
            <Box my={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                avatar={
                                    <img src={logo} alt="Logo" className={'cork'}/>
                                }
                                titleTypographyProps={{variant: 'h5'}}
                                title={'You know better than I'}
                                subheader={`Tell us what should we watch next`}
                            />
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={5}>
                                        <TextField  fullWidth id="standard-basic" label="Your name" />
                                    </Grid>
                                    <Grid item xs={2}>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField fullWidth id="standard-basic" label="Movie name" />
                                        {displayVerticalSpace(8)}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="What's up with this movie?"
                                            multiline
                                            fullWidth
                                            rows={4}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {displayVerticalSpace(8)}
                                        <Button fullWidth variant="contained" color="primary">
                                            Suggest
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}


